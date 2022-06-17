import Fastify, {
  type RawServerDefault,
  type FastifyPluginAsync,
} from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";

const fastify = Fastify().withTypeProvider<TypeBoxTypeProvider>();

const Routes: FastifyPluginAsync<
  Record<never, never>,
  RawServerDefault,
  // Removing this line resolves the TS error, but it is required for
  // accessing the querystring on the request
  TypeBoxTypeProvider
> = async (fastify) => {
  fastify.get(
    "/example",
    {
      schema: {
        querystring: Type.Object({
          s: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      // No TS error on this line
      request.query.s.substring(0, 1);

      return reply.code(200).send();
    }
  );
};

// TS error on the following line
await fastify.register(Routes);
