import {gql} from '@apollo/client'

export const UPDATE_SECTION_MUTATION = gql`
  mutation UpdateSectionMutation($_set: sections_set_input = {}, $sectionId: Int = 10) {
    update_sections(where: {id: {_eq: $sectionId}}, _set: $_set) {
      affected_rows
    }
  }
`
