import {gql} from '@apollo/client'

export const UPDATE_SECTION_BY_SLUG_MUTATION = gql`
  mutation UpdateSectionBySlugMutation(
    $_set: sections_set_input = {}
    $sectionSlug: String = ""
    $bookSlug: String = ""
  ) {
    update_sections(
      where: {_and: {slug: {_eq: $sectionSlug}, prayerbook: {slug: {_eq: $bookSlug}}}}
      _set: $_set
    ) {
      affected_rows
    }
  }
`
