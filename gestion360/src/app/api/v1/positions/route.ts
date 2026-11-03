import { api } from "@/lib/http";
import { createPosition, listPositions, positionInput } from "@/modules/departments/service";

export const GET = api({}, ({ ctx }) => listPositions(ctx));
export const POST = api({ body: positionInput, status: 201 }, ({ ctx, body }) => createPosition(ctx, body));
