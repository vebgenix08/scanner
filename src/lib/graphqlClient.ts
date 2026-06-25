type GraphQLResult<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const endpoint = import.meta.env.VITE_APPSYNC_URL as string | undefined;
const apiKey = import.meta.env.VITE_APPSYNC_API_KEY as string | undefined;

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (!endpoint) {
    throw new Error("Missing VITE_APPSYNC_URL environment variable.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { "x-api-key": apiKey } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = (await response.json()) as GraphQLResult<T>;

  if (!response.ok || payload.errors?.length) {
    throw new Error(payload.errors?.[0]?.message ?? "GraphQL request failed.");
  }

  if (!payload.data) {
    throw new Error("GraphQL response did not include data.");
  }

  return payload.data;
}
