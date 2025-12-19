const session = require("express-session");
const ConnectMongo = require("connect-mongo");

function createMongoStore() {
  const opts = {
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 60 * 60 * 24,
  };

  // connect-mongo v4+ exposes a `create` helper
  if (ConnectMongo && typeof ConnectMongo.create === "function") {
    return ConnectMongo.create(opts);
  }

  // Older connect-mongo versions export a factory function that accepts session
  // (e.g. require('connect-mongo')(session)) or are constructors.
  if (typeof ConnectMongo === "function") {
    try {
      const StoreFactory = ConnectMongo(session);
      return new StoreFactory(opts);
    } catch (err) {
      try {
        return new ConnectMongo(opts);
      } catch (err2) {
        // fallthrough
      }
    }
  }

  // Try default export shape
  if (ConnectMongo && ConnectMongo.default) {
    if (typeof ConnectMongo.default.create === "function") {
      return ConnectMongo.default.create(opts);
    }
    if (typeof ConnectMongo.default === "function") {
      try {
        const StoreFactory = ConnectMongo.default(session);
        return new StoreFactory(opts);
      } catch (err) {
        return new ConnectMongo.default(opts);
      }
    }
  }

  throw new Error("Unsupported connect-mongo version; please install connect-mongo v4+ or a compatible version");
}

module.exports = function (app) {
  const sessionMiddleware = session({
    name: process.env.SESSION_NAME || "medifarm_session",
    secret: process.env.SESSION_SECRET || "medifarm_secret_session",
    resave: false,
    saveUninitialized: false,
    store: createMongoStore(),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
    },
  });

  app.use(sessionMiddleware);
};