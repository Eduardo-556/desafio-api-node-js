import fastify from "fastify";

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

const courses = [
  { id: "1", title: "Curso de Node.js" },
  { id: "2", title: "Curso de React.js" },
  { id: "3", title: "Curso de React Native" },
];

server.get("/courses", () => {
  return courses;
});

server.post("/courses", (request, reply) => {
  const course = courses.push({
    id: String(courses.length + 1),
    title: "Curso de Fastify",
  });

  return reply.status(201).send({ course });
});
