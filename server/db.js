const { Pool } = require("pg");

require("dotenv").config();

const pool = new Pool({
  user: process.env.db_user,
  host: process.env.db_host,
  database: process.env.db_database,
  password: process.env.db_password,
  port: process.env.db_port,
});

const createUser = async (email, password) => {
  try {
    await pool.query('BEGIN');
    const res = await pool.query(
        "INSERT INTO Users (email, password) VALUES ($1, $2) RETURNING uid",
        [email, password]
    );
    await pool.query('COMMIT');
    return res.rows[0].uid;
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error; // Rethrow after rollback to handle error outside
  }
};

const queryUsers = async () => {
  const res = await pool.query("SELECT uid, email FROM users");
  return res.rows;
};

const getUserById = async (id) => {
  const res = await pool.query("SELECT * FROM users WHERE uid = $1", [id]);
  return res.rows[0];
};

const getUserByEmail = async (email) => {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0];
};

const getProfile = async (uid) => {
  const res = await pool.query("SELECT * FROM profile WHERE uid = $1", [uid]);
  return res.rows[0];
};

const getAddress = async (aid) => {
  const res = await pool.query("SELECT * FROM address WHERE aid = $1", [aid]);
  return res.rows[0];
};

const createProfile = async (uid, { user_name, gender, first_name, last_name, aid, apt, description }) => {
  try {
    await pool.query('BEGIN');
    const res = await pool.query(
        "INSERT INTO Profile (uid, user_name, gender, first_name, last_name, aid, apt, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [uid, user_name, gender, first_name, last_name, aid, apt, description]
    );
    await pool.query('COMMIT');
    return res.rowCount > 0;
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error; // Rethrow after rollback to handle error outside
  }
};

const createAddress = async ({
  street_address,
  city,
  state,
  postal_code,
  country,
  longitude,
  latitude,
}) => {
  const res = await pool.query(
    "INSERT INTO Address (street_address, city, state, postal_code, country, longitude, latitude) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING aid",
    [street_address, city, state, postal_code, country, longitude, latitude]
  );
  return res.rows[0].aid;
};

const updateProfile = async (
  uid,
  { user_name, gender, first_name, last_name, aid, apt, description }
) => {
  const res = await pool.query(
    "UPDATE Profile SET user_name = $1, gender = $2, first_name = $3, last_name = $4, aid = $5, apt = $6, description = $7 WHERE uid = $8",
    [user_name, gender, first_name, last_name, aid, apt, description, uid]
  );
  return res.rowCount > 0; // return true if at least one row was updated
};

const updateAddress = async (
  aid,
  { street_address, city, state, postal_code, country, longitude, latitude }
) => {
  const res = await pool.query(
    "UPDATE Address SET street_address = $1, city = $2, state = $3, postal_code = $4, country = $5, longitude = $6, latitude = $7 WHERE aid = $8",
    [
      street_address,
      city,
      state,
      postal_code,
      country,
      longitude,
      latitude,
      aid,
    ]
  );
  return res.rowCount > 0; // return true if at least one row was updated
};

const queryLocalities = async (uid) => {
  const res = await pool.query(
    `SELECT DISTINCT ON (Locality.lid) Locality.*, Subscription.sub_type, Block_Hood_Mapping.hid AS hood_id, 
    Request_Log.decision_status
    FROM Locality
    LEFT JOIN Subscription ON Locality.lid = Subscription.lid AND Subscription.uid = $1
    LEFT JOIN Block_Hood_Mapping ON Locality.lid = Block_Hood_Mapping.bid AND Locality.ltype = 'BLOCK'
    LEFT JOIN Request_Log ON Locality.lid = Request_Log.lid AND Request_Log.sender_uid = $1
    ORDER BY Locality.lid;`,
    [uid]
  );
  return res.rows;
};

const getThread = async (tid) => {
  const res = await pool.query("SELECT * FROM thread WHERE tid = $1", [tid]);
  return res.rows[0];
};

const queryMessages = async (tid) => {
  const res = await pool.query(
    "SELECT message.*, users.email,users.uid FROM message left join users on message.sender_uid=users.uid WHERE tid = $1 order by post_time desc",
    [tid]
  );
  return res.rows;
};

const createThread = async ({ uid, title, feed_type, target_lid }) => {
  const res = await pool.query(
    "INSERT INTO Thread (creator_uid, title,feed_type,target_lid,start_time) VALUES ($1, $2, $3, $4, $5) RETURNING tid",
    [uid, title, feed_type, target_lid, new Date()]
  );
  return res.rows[0].tid;
};
const searchByLocation = async ({ lat, lng }, feet) => {
  const res = await pool.query(
    `SELECT m.mid, m.body, m.post_time, t.title, t.tid
    FROM Message m
            JOIN Thread t ON m.tid = t.tid
    WHERE ST_DWithin(
                  ST_SetSRID(ST_Point(m.longitude, m.latitude), 4326), 
                  ST_SetSRID(ST_Point($2, $1), 4326), 
                  $3 / 3.28084 
          );`,
    [lat, lng, feet]
  );
  return res.rows;
};

const queryThreads = async (uid, type, newMsg) => {
  if (!newMsg) {
    return searchByType(uid, type);
  }
  return searchByTypeWithNewMsg(uid, type);
};
const searchByType = async (uid, feed_type) => {
  const res = await pool.query(
    `SELECT t.title, t.start_time, t.tid
    FROM Message m
             JOIN Thread t ON m.tid = t.tid
    WHERE t.feed_type = $2
      AND (
        (sender_uid = $1) OR 
        EXISTS (
            -- Max has access to threads in his block feed
            SELECT 1 FROM Subscription
            WHERE uid = $1 AND lid = t.target_lid
        ) OR
        EXISTS (
            -- Max has access to threads from his friends, checking that the thread is a friend feed
            SELECT 1 FROM Friend
                              JOIN Thread ON Thread.tid = m.tid AND Thread.feed_type = 'FRIEND'
            WHERE ((sender_uid = $1 AND recipient_uid IN (SELECT sender_uid FROM Message WHERE tid = Thread.tid) AND visibility_status = TRUE) OR
                   (recipient_uid = $1 AND sender_uid IN (SELECT sender_uid FROM Message WHERE tid = Thread.tid) AND visibility_status = TRUE))
        ) OR
        EXISTS (
            -- Max has access to threads from his neighbors, ensuring the thread is a neighbor feed
            SELECT 1 FROM Neighbor
                              JOIN Thread ON Thread.tid = m.tid AND Thread.feed_type = 'NEIGHBOR'
            WHERE ((sender_uid = $1 AND recipient_uid IN (SELECT sender_uid FROM Message WHERE tid = Thread.tid) AND neighbor_status = TRUE) OR
                   (recipient_uid = $1 AND sender_uid IN (SELECT sender_uid FROM Message WHERE tid = Thread.tid) AND neighbor_status = TRUE))
        )
        )
    GROUP BY t.tid, t.start_time, t.title     
    ORDER BY t.start_time DESC
    `,
    [uid, feed_type]
  );
  return res.rows;
};

const searchByTypeWithNewMsg = async (uid, feed_type) => {
  const res = await pool.query(
    `SELECT t.title, t.start_time, t.tid
    FROM Message m
             JOIN Thread t ON m.tid = t.tid
             LEFT JOIN Thread_Access_Log tal ON tal.tid = t.tid AND tal.uid = $1
    WHERE t.feed_type = $2
      AND (tal.last_accessed IS NULL OR m.post_time > tal.last_accessed)
      AND (
        (sender_uid = $1) OR 
        EXISTS (
            -- Max has access to threads in his block feed
            SELECT 1 FROM Subscription
            WHERE uid = $1 AND lid = t.target_lid
        ) OR
        EXISTS (
            -- Max has access to threads from his friends, checking that the thread is a friend feed
            SELECT 1 FROM Friend
                              JOIN Thread ON Thread.tid = m.tid AND Thread.feed_type = 'FRIEND'
            WHERE ((sender_uid = $1 AND recipient_uid IN (SELECT sender_uid FROM Message WHERE tid = Thread.tid) AND visibility_status = TRUE) OR
                   (recipient_uid = $1 AND sender_uid IN (SELECT sender_uid FROM Message WHERE tid = Thread.tid) AND visibility_status = TRUE))
        ) OR
        EXISTS (
            -- Max has access to threads from his neighbors, ensuring the thread is a neighbor feed
            SELECT 1 FROM Neighbor
                              JOIN Thread ON Thread.tid = m.tid AND Thread.feed_type = 'NEIGHBOR'
            WHERE ((sender_uid = $1 AND recipient_uid IN (SELECT sender_uid FROM Message WHERE tid = Thread.tid) AND neighbor_status = TRUE) OR
                   (recipient_uid = $1 AND sender_uid IN (SELECT sender_uid FROM Message WHERE tid = Thread.tid) AND neighbor_status = TRUE))
        )
        )
    GROUP BY t.tid, t.start_time, t.title     
    ORDER BY t.start_time DESC
    `,
    [uid, feed_type]
  );
  return res.rows;
};

const searchByKeyword = async (uid, keyword) => {
  const res = await pool.query(
    `SELECT m.mid, m.body, m.post_time, t.title, t.tid
    FROM Message m
             JOIN Thread t ON m.tid = t.tid
    WHERE m.body ILIKE '%${keyword}%'
      AND (
        EXISTS (
            -- Max has access to threads in his block feed
            SELECT 1 FROM Subscription
            WHERE uid = ${uid} AND lid = t.target_lid
        ) OR
        EXISTS (
            -- Max has access to threads from his friends, checking that the thread is a friend feed
            SELECT 1 FROM Friend
                              JOIN Thread ON Thread.tid = m.tid AND Thread.feed_type = 'FRIEND'
            WHERE ((sender_uid = ${uid} AND recipient_uid IN (SELECT sender_uid FROM Message WHERE tid = Thread.tid) AND visibility_status = TRUE) OR
                   (recipient_uid = ${uid} AND sender_uid IN (SELECT sender_uid FROM Message WHERE tid = Thread.tid) AND visibility_status = TRUE))
        ) OR
        EXISTS (
            -- Max has access to threads from his neighbors, ensuring the thread is a neighbor feed
            SELECT 1 FROM Neighbor
                              JOIN Thread ON Thread.tid = m.tid AND Thread.feed_type = 'NEIGHBOR'
            WHERE ((sender_uid = ${uid} AND recipient_uid IN (SELECT sender_uid FROM Message WHERE tid = Thread.tid) AND neighbor_status = TRUE) OR
                   (recipient_uid = ${uid} AND sender_uid IN (SELECT sender_uid FROM Message WHERE tid = Thread.tid) AND neighbor_status = TRUE))
        )
        )
    ORDER BY m.post_time DESC;`
  );
  return res.rows;
};

const createMessage = async ({
  tid,
  sender_uid,
  reply_to_mid,
  body,
  longitude,
  latitude,
  target_lid,
}) => {
  const res = await pool.query(
    "INSERT INTO Message (tid, sender_uid, reply_to_mid, body, post_time, longitude, latitude, target_lid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      tid,
      sender_uid,
      reply_to_mid,
      body,
      new Date(),
      longitude,
      latitude,
      target_lid,
    ]
  );
  return res.rowCount > 0; // return true if at least one row was inserted
};

const queryFriends = async (uid) => {
  const res = await pool.query(
    `SELECT f.*, u1.email as sender_email, u2.email as recipient_email FROM Friend f
    JOIN Users u1 ON f.sender_uid = u1.uid
    JOIN Users u2 ON f.recipient_uid = u2.uid
WHERE (sender_uid = $1 OR recipient_uid = $1)`,
    [uid]
  );
  return res.rows;
};

const requestFriend = async (uid, friend_id) => {
  const res = await pool.query(
    "INSERT INTO Friend (sender_uid, recipient_uid, request_time) VALUES ($1, $2, $3)",
    [uid, friend_id, new Date()]
  );
  return res.rowCount > 0; // return true if at least one row was inserted
};
const rejectFriend = async (uid, friend_id) => {
  const res = await pool.query(
    "DELETE FROM Friend WHERE sender_uid = $2 AND recipient_uid = $1",
    [uid, friend_id]
  );
  return res.rowCount > 0; // return true if at least one row was inserted
};
const approvedFriend = async (uid, friend_id) => {
  const res = await pool.query(
    `UPDATE Friend
    SET visibility_status = TRUE, decision_time =  $1
    WHERE (sender_uid = $3 AND recipient_uid = $2)`,
    [new Date(), uid, friend_id]
  );
  return res.rowCount > 0; // return true if at least one row was inserted
};

const queryNeighbors = async (uid) => {
  const res = await pool.query(
    `SELECT n.*, u1.email as sender_email, u2.email as recipient_email FROM Neighbor n
    JOIN Users u1 ON n.sender_uid = u1.uid
    JOIN Users u2 ON n.recipient_uid = u2.uid
WHERE (sender_uid = $1 OR recipient_uid = $1)`,
    [uid]
  );
  return res.rows;
};

const requestNeighbor = async (uid, neighbor_id) => {
  const res = await pool.query(
    "INSERT INTO Neighbor (sender_uid, recipient_uid, established_time) VALUES ($1, $2, $3)",
    [uid, neighbor_id, new Date()]
  );
  return res.rowCount > 0; // return true if at least one row was inserted
};

const subscriptionLocality = async (uid, lid, sub_type) => {
  const res = await pool.query(
    `INSERT INTO Subscription (uid, lid, sub_type)
    VALUES ($1, $2, $3)
    ON CONFLICT (uid, lid) 
    DO UPDATE SET sub_type = $3;`,
    [uid, lid, sub_type]
  );
  return res.rowCount > 0; // return true if at least one row was inserted
};

const joinLocality = async (uid, lid) => {
  const res = await pool.query(
    `INSERT INTO Request_Log (sender_uid, lid)
    VALUES ($1, $2);`,
    [uid, lid]
  );
  return res.rowCount > 0; // return true if at least one row was inserted
};

const pendingUsers = async (uid, lid) => {
  const res = await pool.query(
    `SELECT r.rid, u.uid, u.email, a.approved FROM Request_Log r
    JOIN Users u ON r.sender_uid = u.uid
    LEFT JOIN Approval_Log a ON a.rid = r.rid and a.approver_uid = $1
    WHERE r.decision_status = 'PENDING' AND r.lid = $1;`,
    [lid]
  );
  return res.rows;
};

const approvalRequest = async (rid, uid, approved) => {
  const res = await pool.query(
    `INSERT INTO approval_log(rid, approver_uid,approved)
    VALUES ($1, $2,$3);`,
    [rid, uid, approved]
  );
  return res.rowCount > 0; // return true if at least one row was inserted
};

const newMembers = async (lid) => {
  const res = await pool.query(
    `SELECT p.*,a.*, u.email FROM Subscription s
    JOIN Users u ON s.uid = u.uid
    JOIN Profile p ON p.uid = u.uid
    JOIN Address a ON p.aid = a.aid
    WHERE s.sub_type = 'MEMBER' AND s.lid = $1;`,
    [lid]
  );
  return res.rows;
};

const updateThreadAccess = async (uid, tid) => {
  const res = await pool.query(
    `INSERT INTO Thread_Access_Log (uid, tid, last_accessed)
    VALUES ($1, $2, $3)
    ON CONFLICT (uid, tid)
    DO UPDATE SET last_accessed = $3;`,
    [uid, tid, new Date()]
  );
  return res.rowCount > 0; // return true if at least one row was inserted
};

const updateMessageAccess = async (uid, mid) => {
  const res = await pool.query(
    `INSERT INTO Message_Access_Log (uid, u_mid, last_accessed)
    VALUES ($1, $2, $3)
    ON CONFLICT (uid, u_mid)
    DO UPDATE SET last_accessed = $3;`,
    [uid, mid, new Date()]
  );
  return res.rowCount > 0; // return true if at least one row was inserted
};

const updateProfileAccess = async (uid, pid) => {
  const res = await pool.query(
    `INSERT INTO Profile_Access_Log (uid, profile_uid, last_accessed)
    VALUES ($1, $2, $3)
    ON CONFLICT (uid, profile_uid)
    DO UPDATE SET last_accessed = $3;`,
    [uid, pid, new Date()]
  );
  return res.rowCount > 0; // return true if at least one row was inserted
};

module.exports = {
  pool,
  queryUsers,
  createUser,
  getUserById,
  getUserByEmail,
  getAddress,
  getProfile,
  createProfile,
  createAddress,
  updateProfile,
  updateAddress,
  queryThreads,
  getThread,
  queryMessages,
  createThread,
  createMessage,
  queryLocalities,
  searchByKeyword,
  searchByLocation,
  queryFriends,
  requestFriend,
  rejectFriend,
  approvedFriend,
  queryNeighbors,
  requestNeighbor,
  subscriptionLocality,
  joinLocality,
  pendingUsers,
  approvalRequest,
  newMembers,
  updateThreadAccess,
  updateMessageAccess,
  updateProfileAccess,
};
