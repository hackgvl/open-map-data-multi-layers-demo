/*
 * Creates a Talkback server for use as a proxy server during tests.
 *
 * Responses to external services are initially recorded for use as test fixtures
 * to prevent the need for reaching back out each time the test suite is run.
 */
import talkback from "talkback";
import type Tape from "talkback/tape";

const record_mode = () => {
  if (process.env.OVERWRITE_TAPES) {
    console.log("Overwriting existing tapes.");
    return talkback.Options.RecordMode.OVERWRITE;
  }

  console.log(
    "Attempting to reuse existing tapes and will save anything new that I come across.",
  );
  return talkback.Options.RecordMode.NEW;
};

const create_talkback_server = async () => {
  console.log(process.env.OVERWRITE_TAPES);

  const opts = {
    host: "https://data.openupstate.org",
    record: record_mode(),
    port: 9090,
    path: "./src/tests/tapes",
    http: true,
    tapeNameGenerator(tapeNumber: number, tape: Tape) {
      return `${tape.req.url}/${tapeNumber}`;
    },
  };

  const server = talkback(opts);
  server.start(() => console.log("Talkback Server Started"));

  return async () => {
    server.close(() => console.log("Talkback Server Closed"));
  };
};

// Server can be launched independently by calling
//   DIRECT=enabled npx tsx talkback-server.ts
if (process.env.DIRECT === "enabled") {
  create_talkback_server();
}

export default create_talkback_server;
