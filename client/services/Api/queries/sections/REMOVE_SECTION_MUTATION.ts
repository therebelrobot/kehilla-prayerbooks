import {gql} from '@apollo/client'

export const REMOVE_SECTION_MUTATION = gql`
  mutation RemoveSectionMutation($sectionId: Int = 10) {
    delete_sections(where: {id: {_eq: $sectionId}}) {
      affected_rows
    }
  }
`
