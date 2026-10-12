import { createClient, type QueryParams } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export const clientFetch = async <
  QueryResponse,
  const QueryString extends string = string,
>({
  query,
  params = {},
  tags = [],
}: {
  query: QueryString;
  params?: QueryParams;
  tags?: string[];
}): Promise<QueryResponse> => {
  return client.fetch<QueryResponse>(query, params, {
    // re-checked at most every 60s, so Studio publishes reach the live site
    // within about a minute (blogs use this helper)
    next: {
      revalidate: 60,
      tags,
    },
  });
};
