import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GetPosts(
    $filters: PostFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    posts(filters: $filters, pagination: $pagination, sort: $sort) {
      documentId
      title
      slug
      excerpt
      publishedAt
      coverImage {
        url
        alternativeText
        width
        height
      }
      category {
        name
        slug
      }
      author {
        name
        bio
        avatar {
          url
          alternativeText
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    posts(filters: { slug: { eq: $slug } }) {
      documentId
      title
      slug
      excerpt
      content
      publishedAt
      coverImage {
        url
        alternativeText
        width
        height
      }
      category {
        name
        slug
      }
      author {
        name
        bio
        avatar {
          url
          alternativeText
        }
      }
    }
  }
`;
