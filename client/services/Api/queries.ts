import {gql, useMutation, useQuery} from '@apollo/client'

import {localStorage} from '_/utils/localStorage'

const GREETING_LOCATION_QUERY = gql`
  query GreetingLocationQuery {
    greetingLocation {
      name
      geolocation
    }
  }
`

export const useGreetingLocation = () => useQuery(GREETING_LOCATION_QUERY)

const LIST_PRAYERBOOKS_QUERY = gql`
  query ListPrayerbooksQuery {
    prayerbooks {
      name
      status
      pdf_link
      id
      slug
    }
  }
`
export const useListPrayerbooks = () => {
  const {data, ...rest} = useQuery(LIST_PRAYERBOOKS_QUERY, {
    context: {headers: {authorization: `Bearer ${localStorage().getItem('auth_token')}`}},
  })
  let books = data
  if (data) {
    books = data.prayerbooks.map((pb) => {
      const newPb = {...pb}
      delete newPb.__typename
      return newPb
    })
  }
  return {...rest, books}
}

const INSERT_PROSE_MUTATION = gql`
  mutation InsertProseMutation($prayer_id: Int, $tiptap_content: jsonb) {
    insert_prose(
      objects: [{prayer_id: $prayer_id, tiptap_content: $tiptap_content}]
      on_conflict: {constraint: prose_pkey, update_columns: [tiptap_content]}
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`
const UPDATE_PROSE_MUTATION = gql`
  mutation UpdateProseMutation($id: Int, $prayer_id: Int, $tiptap_content: jsonb) {
    update_prose(where: {id: {_eq: $id}}, _set: {tiptap_content: $tiptap_content}) {
      affected_rows
      returning {
        id
      }
    }
  }
`
export const useUpdateProse = () => {
  const [updateProse, {loading, error, data}] = useMutation(UPDATE_PROSE_MUTATION, {
    context: {headers: {authorization: `Bearer ${localStorage().getItem('auth_token')}`}},
  })

  return {updateProse, loading, error, data}
}
export const useInsertProse = () => {
  const [insertProse, {loading, error, data}] = useMutation(INSERT_PROSE_MUTATION, {
    context: {headers: {authorization: `Bearer ${localStorage().getItem('auth_token')}`}},
  })
  return {insertProse, loading, error, data}
}

const GET_SECTIONS_BY_BOOK_SLUG_QUERY = gql`
  query GetSectionsByBookSlugQuery($bookSlug: String!) {
    prayerbooks(where: {slug: {_eq: $bookSlug}}) {
      name
      status
      pdf_link
      id
      slug
      sections {
        id
        is_supplemental
        name
        pdf_page
        prayer_order
        slug
      }
    }
  }
`

export const useGetSectionsByBookSlug = (bookSlug) => {
  console.log('useGetSectionsByBookSlug', bookSlug)
  const {data, ...rest} = useQuery(GET_SECTIONS_BY_BOOK_SLUG_QUERY, {
    variables: {bookSlug},
    context: {headers: {authorization: `Bearer ${localStorage().getItem('auth_token')}`}},
  })

  let sections = []
  if (data) {
    sections = data.prayerbooks[0].sections
  }
  return {...rest, data, sections}
}

const GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY = gql`
  query GetPrayersBySectionAndBookSlugQuery($bookSlug: String!, $sectionSlug: String!) {
    prayerbooks(where: {slug: {_eq: $bookSlug}}) {
      name
      status
      pdf_link
      id
      slug
      sections(where: {slug: {_eq: $sectionSlug}}) {
        id
        slug
        is_supplemental
        name
        pdf_page
        prayer_order
        prayers {
          id
          slug
          name
          line_prose_order
        }
      }
    }
  }
`

export const useGetPrayersBySectionAndBookSlug = (bookSlug, sectionSlug) => {
  console.log('useGetSectionsByBookSlug', bookSlug)
  const {data, ...rest} = useQuery(GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, {
    variables: {bookSlug, sectionSlug},
    context: {headers: {authorization: `Bearer ${localStorage().getItem('auth_token')}`}},
  })

  let prayers = []
  if (data) {
    prayers = data.prayerbooks[0].sections[0].prayers
  }
  return {...rest, data, prayers}
}

const GET_PRAYERS_PROSE_AND_LINES = gql`
  query GetPrayersProseAndLines($bookSlug: String!, $sectionSlug: String!, $prayerSlug: String!) {
    prayerbooks(where: {slug: {_eq: $bookSlug}}) {
      name
      status
      pdf_link
      id
      slug
      sections(where: {slug: {_eq: $sectionSlug}}) {
        id
        slug
        is_supplemental
        name
        pdf_page
        prayer_order
        prayers(where: {slug: {_eq: $prayerSlug}}) {
          id
          slug
          name
          line_prose_order
          prayer_lines {
            id
            hebrew
            notes
            translation
            transliteration
          }
          proses {
            tiptap_content
            prayer_slug
            id
          }
        }
      }
    }
  }
`

export const useGetProseAndLines = (bookSlug, sectionSlug, prayerSlug) => {
  console.log('useGetSectionsByBookSlug', bookSlug)
  const {data, ...rest} = useQuery(GET_PRAYERS_PROSE_AND_LINES, {
    variables: {bookSlug, sectionSlug, prayerSlug},
    context: {headers: {authorization: `Bearer ${localStorage().getItem('auth_token')}`}},
  })

  let prose = []
  let lines = []
  let order = []
  if (data) {
    prose = data.prayerbooks[0].sections[0].prayers[0].proses
    lines = data.prayerbooks[0].sections[0].prayers[0].lines
    order = data.prayerbooks[0].sections[0].prayers[0].line_prose_order || []
  }
  const ordered = order.map((typeId) => {
    const [type, id] = typeId.split('-')
    if (type === 'prose') {
      return prose.find((p) => (p.id = Number(id)))
    }
    return lines.find((l) => (l.id = Number(id)))
  })
  return {...rest, data, prose, lines, ordered}
}
