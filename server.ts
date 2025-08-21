import fastify from "fastify";
import { db } from "./src/database/client.ts";
import { courses } from "./src/database/schema.ts";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server is running!");
});

server.get("/courses", async (request, reply) => {
  const result = await db.select().from(courses);
  return reply.send({ courses: result });
});

server.post("/courses", async (request, reply) => {
  type Body = {
    title: string;
  };

  const body = request.body as Body;
  const courserTitle = body.title;

  if (!courserTitle) {
    return reply.status(400).send({ message: "Título obrigatório." });
  }

  const result = await db
    .insert(courses)
    .values({ title: courserTitle })
    .returning();
  return reply.status(201).send({ courseId: result[0].id });
});
