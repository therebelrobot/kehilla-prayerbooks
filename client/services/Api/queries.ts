import {gql, useMutation, useQuery} from '@apollo/client'
import {localStorage} from '_/utils/localStorage'

const contextIfTokenPresent = () => {
  const token = localStorage().getItem('auth_token')
  if (!token) return undefined
  return {
    context: {headers: {authorization: `Bearer ${token}`}},
  }
}

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
  const {data, ...rest} = useQuery(LIST_PRAYERBOOKS_QUERY, contextIfTokenPresent())
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
  const [updateProse, {loading, error, data}] = useMutation(
    UPDATE_PROSE_MUTATION,
    contextIfTokenPresent()
  )

  return {updateProse, loading, error, data}
}
export const useInsertProse = () => {
  const [insertProse, {loading, error, data}] = useMutation(
    INSERT_PROSE_MUTATION,
    contextIfTokenPresent()
  )
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
    ...contextIfTokenPresent(),
    variables: {bookSlug},
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
    ...contextIfTokenPresent(),
    variables: {bookSlug, sectionSlug},
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
    ...contextIfTokenPresent(),
    variables: {bookSlug, sectionSlug, prayerSlug},
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

const INSERT_BOOK_MUTATION = gql`
  mutation InsertBookMutation(
    $name: String = ""
    $pdf_link: String = ""
    $slug: String = ""
    $status: String = ""
  ) {
    insert_prayerbooks(
      objects: [{name: $name, pdf_link: $pdf_link, slug: $slug, status: $status}]
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`
const UPDATE_BOOK_MUTATION = gql`
  mutation UpdateBookMutation($_set: prayerbooks_set_input = {}, $bookId: Int = 0) {
    update_prayerbooks(where: {id: {_eq: $bookId}}, _set: $_set) {
      affected_rows
    }
  }
`
const REMOVE_BOOK_MUTATION = gql`
  mutation RemoveBookMutation($bookId: Int = 0) {
    delete_prayerbooks(where: {id: {_eq: $bookId}}) {
      affected_rows
    }
  }
`
export const useUpdateBook = (bookId) => {
  const [updateBook, {loading, error, data}] = useMutation(UPDATE_BOOK_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {bookId},
    refetchQueries: [{query: LIST_PRAYERBOOKS_QUERY}],
  })

  return {updateBook, loading, error, data}
}
export const useInsertBook = () => {
  const [insertBook, {loading, error, data}] = useMutation(INSERT_BOOK_MUTATION, {
    ...contextIfTokenPresent(),
    refetchQueries: [{query: LIST_PRAYERBOOKS_QUERY}],
  })
  return {insertBook, loading, error, data}
}
export const useRemoveBook = (bookId) => {
  const [removeBook, {loading, error, data}] = useMutation(REMOVE_BOOK_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {bookId},
    refetchQueries: [{query: LIST_PRAYERBOOKS_QUERY}],
  })

  return {removeBook, loading, error, data}
}

const INSERT_SECTION_MUTATION = gql`
  mutation InsertBookMutation(
    $name: String = ""
    $pdf_page: Int = 0
    $slug: String = ""
    $book_slug: String = ""
  ) {
    insert_sections(
      objects: [{name: $name, pdf_page: $pdf_page, slug: $slug, book_slug: $book_slug}]
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`
const UPDATE_SECTION_MUTATION = gql`
  mutation UpdateSectionMutation($_set: sections_set_input = {}, $sectionId: Int = 10) {
    update_sections(where: {id: {_eq: $sectionId}}, _set: $_set) {
      affected_rows
    }
  }
`
const REMOVE_SECTION_MUTATION = gql`
  mutation RemoveSectionMutation($sectionId: Int = 10) {
    delete_sections(where: {id: {_eq: $sectionId}}) {
      affected_rows
    }
  }
`
export const useUpdateSection = (sectionId, bookSlug) => {
  const [updateSection, {loading, error, data}] = useMutation(UPDATE_SECTION_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {sectionId},
    refetchQueries: [{query: GET_SECTIONS_BY_BOOK_SLUG_QUERY, variables: {bookSlug}}],
  })

  return {updateSection, loading, error, data}
}
export const useInsertSection = (bookSlug) => {
  const [insertSection, {loading, error, data}] = useMutation(INSERT_SECTION_MUTATION, {
    ...contextIfTokenPresent(),
    refetchQueries: [{query: GET_SECTIONS_BY_BOOK_SLUG_QUERY, variables: {bookSlug}}],
  })
  return {insertSection, loading, error, data}
}
export const useRemoveSection = (sectionId, bookSlug) => {
  const [removeSection, {loading, error, data}] = useMutation(REMOVE_SECTION_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {sectionId},
    refetchQueries: [{query: GET_SECTIONS_BY_BOOK_SLUG_QUERY, variables: {bookSlug}}],
  })

  return {removeSection, loading, error, data}
}

const INSERT_PRAYER_MUTATION = gql`
  mutation InsertBookMutation($name: String = "", $slug: String = "", $section_slug: String = "") {
    insert_prayers(objects: [{name: $name, slug: $slug, section_slug: $section_slug}]) {
      affected_rows
      returning {
        id
      }
    }
  }
`
const UPDATE_PRAYER_MUTATION = gql`
  mutation UpdatePrayerMutation($_set: prayers_set_input = {}, $prayerId: Int = 10) {
    update_prayers(where: {id: {_eq: $prayerId}}, _set: $_set) {
      affected_rows
    }
  }
`
const REMOVE_PRAYER_MUTATION = gql`
  mutation RemovePrayerMutation($prayerId: Int = 10) {
    delete_prayers(where: {id: {_eq: $prayerId}}) {
      affected_rows
    }
  }
`
export const useUpdatePrayer = (prayerId, bookSlug, sectionSlug) => {
  const [updatePrayer, {loading, error, data}] = useMutation(UPDATE_PRAYER_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {prayerId},
    refetchQueries: [
      {query: GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, variables: {bookSlug, sectionSlug}},
    ],
  })

  return {updatePrayer, loading, error, data}
}
export const useInsertPrayer = (bookSlug, sectionSlug) => {
  const [insertPrayer, {loading, error, data}] = useMutation(INSERT_PRAYER_MUTATION, {
    ...contextIfTokenPresent(),
    refetchQueries: [
      {query: GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, variables: {bookSlug, sectionSlug}},
    ],
  })
  return {insertPrayer, loading, error, data}
}
export const useRemovePrayer = (prayerId, bookSlug, sectionSlug) => {
  const [removePrayer, {loading, error, data}] = useMutation(REMOVE_PRAYER_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {prayerId},
    refetchQueries: [
      {query: GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, variables: {bookSlug, sectionSlug}},
    ],
  })

  return {removePrayer, loading, error, data}
}
