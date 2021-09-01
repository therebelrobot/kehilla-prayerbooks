import {useState} from 'react'

import {
    gql, useLazyQuery, useMutation, useQuery, useSubscription
} from '@apollo/client'

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

export const GET_SECTIONS_BY_BOOK_SLUG_QUERY = gql`
  query GetSectionsByBookSlugQuery($bookSlug: String!) {
    prayerbooks(where: {slug: {_eq: $bookSlug}}) {
      name
      status
      pdf_link
      id
      slug
      section_order
      sections {
        id
        is_supplemental
        name
        prayer_order
        slug
        prayers_aggregate {
          aggregate {
            min {
              from_page
            }
            max {
              to_page
            }
          }
        }
      }
    }
  }
`

export const useGetSectionsByBookSlug = (bookSlug) => {
  // console.log('useGetSectionsByBookSlug', bookSlug)
  const {data, ...rest} = useQuery(GET_SECTIONS_BY_BOOK_SLUG_QUERY, {
    ...contextIfTokenPresent(),
    variables: {bookSlug},
  })

  let sections = []
  let status = 'UNSTARTED'
  let sectionOrder = []
  let orderedSections = []
  let bookId = null

  if (data) {
    sections = data.prayerbooks[0].sections.map((s) => ({
      ...s,
      toFromPages: [
        s.prayers_aggregate.aggregate.min.from_page || 0,
        s.prayers_aggregate.aggregate.max.to_page || 0,
      ],
    }))
    status = data.prayerbooks[0].status
    sectionOrder = data.prayerbooks[0].section_order || []
    orderedSections = sectionOrder.map((id) => sections.find((s) => s.id === id))
    bookId = data.prayerbooks[0].id
    console.log({sections, status, sectionOrder, orderedSections})
  }
  return {...rest, data, sections, status, sectionOrder, orderedSections, bookId}
}

export const GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY = gql`
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
        prayer_order
        prayers {
          id
          slug
          name
          line_prose_order
          from_page
          to_page
        }
      }
    }
  }
`

export const useGetPrayersBySectionAndBookSlug = (bookSlug, sectionSlug) => {
  // console.log('useGetSectionsByBookSlug', bookSlug)
  const {data, ...rest} = useQuery(GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, {
    ...contextIfTokenPresent(),
    variables: {bookSlug, sectionSlug},
  })

  let prayers = []
  let prayerOrder = []
  let orderedPrayers = []
  let sectionId = null
  if (data) {
    prayers = data.prayerbooks[0].sections[0].prayers
    prayerOrder = data.prayerbooks[0].sections[0].prayer_order
    orderedPrayers = prayerOrder.map((id) => prayers.find((p) => p.id === id))
    sectionId = data.prayerbooks[0].sections[0].id
  }
  return {...rest, data, prayers, prayerOrder, orderedPrayers, sectionId}
}

export const GET_PRAYERS_PROSE_AND_LINES = gql`
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
        prayer_order
        prayers(where: {slug: {_eq: $prayerSlug}}) {
          id
          slug
          name
          line_prose_order
          from_page
          to_page
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
  // console.log('useGetSectionsByBookSlug', bookSlug)
  const {data, ...rest} = useQuery(GET_PRAYERS_PROSE_AND_LINES, {
    ...contextIfTokenPresent(),
    variables: {bookSlug, sectionSlug, prayerSlug},
  })

  let prose = []
  let lines = []
  let order = []
  let prayerId = null
  let prayer = null
  if (data) {
    prayerId = data.prayerbooks[0].sections[0].prayers[0].id
    prose = data.prayerbooks[0].sections[0].prayers[0].proses
    lines = data.prayerbooks[0].sections[0].prayers[0].prayer_lines
    order = data.prayerbooks[0].sections[0].prayers[0].line_prose_order || []
    prayer = data.prayerbooks[0].sections[0].prayers[0]
  }
  // console.log({prose, lines, order})
  const ordered = order.map((typeId) => {
    const [type, id] = typeId.split('-')
    if (type === 'prose') {
      const foundProse = prose.find((p) => p.id === Number(id))
      // console.log({foundProse, prose})
      return {...foundProse, type}
    }
    return {...lines.find((l) => l.id === Number(id)), type}
  })
  return {...rest, data, prayer, prose, lines, ordered, lineProseOrder: order, prayerId}
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
export const useUpdatePrayer = (prayerId, bookSlug, sectionSlug, prayerSlug = '') => {
  const [updatePrayer, {loading, error, data}] = useMutation(UPDATE_PRAYER_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {prayerId},
    refetchQueries: [
      {query: GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, variables: {bookSlug, sectionSlug}},
      ...(prayerSlug.length
        ? [{query: GET_PRAYERS_PROSE_AND_LINES, variables: {bookSlug, sectionSlug, prayerSlug}}]
        : []),
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

const INSERT_PROSE_MUTATION = gql`
  mutation InsertProseMutation($prayer_slug: String, $tiptap_content: jsonb) {
    insert_prose(
      objects: [{prayer_slug: $prayer_slug, tiptap_content: $tiptap_content}]
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
  mutation UpdateProseMutation($id: Int, $tiptap_content: jsonb) {
    update_prose(where: {id: {_eq: $id}}, _set: {tiptap_content: $tiptap_content}) {
      affected_rows
      returning {
        id
      }
    }
  }
`
const REMOVE_PROSE_MUTATION = gql`
  mutation RemoveProseMutation($id: Int = 10) {
    delete_prose(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`

export const useInsertProse = (bookSlug, sectionSlug, prayerSlug) => {
  const [insertProse, {loading, error, data}] = useMutation(INSERT_PROSE_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {prayer_slug: prayerSlug},
    refetchQueries: [
      {query: GET_PRAYERS_PROSE_AND_LINES, variables: {bookSlug, sectionSlug, prayerSlug}},
    ],
  })
  return {insertProse, loading, error, data}
}

export const useUpdateProse = (bookSlug, sectionSlug, prayerSlug) => {
  const [updateProse, {loading, error, data}] = useMutation(UPDATE_PROSE_MUTATION, {
    ...contextIfTokenPresent(),
    refetchQueries: [
      {query: GET_PRAYERS_PROSE_AND_LINES, variables: {bookSlug, sectionSlug, prayerSlug}},
    ],
  })

  return {updateProse, loading, error, data}
}

export const useRemoveProse = (id, prayerSlug, sectionSlug, bookSlug) => {
  // console.log('useRemoveProse', {id, prayerSlug, sectionSlug, bookSlug})
  const [removeProse, {loading, error, data}] = useMutation(REMOVE_PROSE_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {id},
    refetchQueries: [
      {query: GET_PRAYERS_PROSE_AND_LINES, variables: {prayerSlug, sectionSlug, bookSlug}},
    ],
  })

  return {removeProse, loading, error, data}
}

export const INSERT_LINE_MUTATION = gql`
  mutation InsertLineMutation(
    $hebrew: String = ""
    $notes: String = ""
    $prayer_slug: String = ""
    $translation: String = ""
    $transliteration: String = ""
  ) {
    insert_prayer_lines(
      objects: {
        hebrew: $hebrew
        notes: $notes
        prayer_slug: $prayer_slug
        translation: $translation
        transliteration: $transliteration
      }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`

const UPDATE_LINE_MUTATION = gql`
  mutation UpdateLineMutation($id: Int = 10, $_set: prayer_lines_set_input = {}) {
    update_prayer_lines(where: {id: {_eq: $id}}, _set: $_set) {
      affected_rows
    }
  }
`

const REMOVE_LINE_MUTATION = gql`
  mutation RemoveLineMutation($id: Int = 10) {
    delete_prayer_lines(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`
export const useInsertLine = (bookSlug, sectionSlug, prayerSlug) => {
  const [insertLine, {loading, error, data}] = useMutation(INSERT_LINE_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {prayer_slug: prayerSlug},
    refetchQueries: [
      {query: GET_PRAYERS_PROSE_AND_LINES, variables: {bookSlug, sectionSlug, prayerSlug}},
    ],
  })
  return {insertLine, loading, error, data}
}

export const useUpdateLine = (bookSlug, sectionSlug, prayerSlug) => {
  const [updateLine, {loading, error, data}] = useMutation(UPDATE_LINE_MUTATION, {
    ...contextIfTokenPresent(),
    refetchQueries: [
      {query: GET_PRAYERS_PROSE_AND_LINES, variables: {bookSlug, sectionSlug, prayerSlug}},
    ],
  })

  return {updateLine, loading, error, data}
}

export const useRemoveLine = (id, prayerSlug, sectionSlug, bookSlug) => {
  // console.log('useRemoveLine', {id, prayerSlug, sectionSlug, bookSlug})
  const [removeLine, {loading, error, data}] = useMutation(REMOVE_LINE_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {id},
    refetchQueries: [
      {query: GET_PRAYERS_PROSE_AND_LINES, variables: {prayerSlug, sectionSlug, bookSlug}},
    ],
  })

  return {removeLine, loading, error, data}
}

export const INSERT_READING_MUTATION = gql`
  mutation InsertReadingMutation(
    $created_by: String = ""
    $session_id: String = ""
    $current_url: String = ""
  ) {
    insert_readings_one(
      object: {session_id: $session_id, current_url: $current_url, created_by: $created_by}
    ) {
      id
    }
  }
`
export const useCreateReading = (userId) => {
  const [createReading, {loading, error, data}] = useMutation(INSERT_READING_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {created_by: userId},
  })
  return {createReading, loading, error, data}
}

export const FOLLOW_READING_SUBSCRIPTION = gql`
  subscription FollowReadingSubscription($sessionId: String = "") {
    readings(where: {session_id: {_eq: $sessionId}}) {
      current_url
      current_location_id
      connected_readers_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`

export const useFollowReading = (sessionId, opts = {}) => {
  const [currentUrl, setCurrentUrl] = useState(null)
  const [currentLocationId, setCurrentLocationId] = useState(null)
  const [connectedCount, setConnectedCount] = useState(null)
  const {data, loading, error} = useSubscription(FOLLOW_READING_SUBSCRIPTION, {
    ...contextIfTokenPresent(),
    variables: {sessionId},
    ...opts,
    onSubscriptionData: (...args) => {
      console.log('onSubscriptionData', args)
      const thisReading = args[0].subscriptionData.data.readings[0]

      setCurrentUrl(thisReading ? thisReading.current_url : null)
      setCurrentLocationId(thisReading ? thisReading.current_location_id : null)
      setConnectedCount(thisReading ? thisReading.connected_readers_aggregate.aggregate.count : 0)
      if (!opts.onSubscriptionData) return
      return opts.onSubscriptionData(...args)
    },
    options: {
      ...opts.options,
      reconnect: !!sessionId,
    },
  })
  console.log('useFollowReading', data)
  return {
    currentUrl,
    currentLocationId,
    connectedCount,
    data,
    loading,
    error,
  }
}

export const UPDATE_STARTED_SESSION_MUTATION = gql`
  mutation UpdateStartedSessionMutation($sessionId: String = "", $_set: readings_set_input = {}) {
    update_readings(where: {session_id: {_eq: $sessionId}}, _set: $_set) {
      affected_rows
    }
  }
`
export const useUpdateStartedSession = () => {
  const [updateStartedSession, {data, loading, error}] = useMutation(
    UPDATE_STARTED_SESSION_MUTATION,
    {
      ...contextIfTokenPresent(),
    }
  )
  return {updateStartedSession, data, loading, error}
}
export const REMOVE_STARTED_SESSION_MUTATION = gql`
  mutation RemoveStartedSessionMutation($sessionId: String = "") {
    delete_readings(where: {session_id: {_eq: $sessionId}}) {
      affected_rows
    }
  }
`
export const useRemoveStartedSession = () => {
  const [removeStartedSession, {data, loading, error}] = useMutation(
    REMOVE_STARTED_SESSION_MUTATION,
    {
      ...contextIfTokenPresent(),
    }
  )
  return {removeStartedSession, data, loading, error}
}

export const INSERT_CONNECTED_READER_MUTATION = gql`
  mutation InsertConnectedReaderMutation(
    $reader_id: String = ""
    $session_id: String = ""
    $user_id: String = null
  ) {
    insert_connected_readers(
      objects: {reader_id: $reader_id, session_id: $session_id, user_id: $user_id}
      on_conflict: {constraint: connected_readers_pkey, update_columns: [session_id, user_id]}
    ) {
      affected_rows
    }
  }
`
export const useInsertConnectedReader = () => {
  const [insertConnectedReader, {data, loading, error}] = useMutation(
    INSERT_CONNECTED_READER_MUTATION,
    {
      ...contextIfTokenPresent(),
    }
  )
  return {insertConnectedReader, data, loading, error}
}

export const REMOVE_CONNECTED_READER_MUTATION = gql`
  mutation RemoveConnectedReaderMutation($reader_id: String = "") {
    delete_connected_readers(where: {reader_id: {_eq: $reader_id}}) {
      affected_rows
    }
  }
`
export const useRemoveConnectedReader = () => {
  const [removeConnectedReader, {data, loading, error}] = useMutation(
    REMOVE_CONNECTED_READER_MUTATION,
    {
      ...contextIfTokenPresent(),
    }
  )
  return {removeConnectedReader, data, loading, error}
}

export const GET_CONNECTED_READER_BY_ID_QUERY = gql`
  query GetConnectedReaderByIdQuery($reader_id: String = "") {
    connected_readers(where: {reader_id: {_eq: $reader_id}}) {
      session_id
    }
  }
`
export const useLazyGetConnectedReaderById = (opts = {}) => {
  const [getConnectedReaderById, {data, loading, error}] = useLazyQuery(
    GET_CONNECTED_READER_BY_ID_QUERY,
    {
      ...contextIfTokenPresent(),
      ...opts,
    }
  )
  return {getConnectedReaderById, data, loading, error}
}

export const GET_SESSION_BY_USER_ID_QUERY = gql`
  query GetSessionByUserIdQuery($user_id: String = "") {
    readings(where: {created_by_user: {id: {_eq: $user_id}}}) {
      session_id
    }
  }
`
export const useLazyGetSessionByUserId = (opts = {}) => {
  const [getSessionByUserId, {data, loading, error}] = useLazyQuery(GET_SESSION_BY_USER_ID_QUERY, {
    ...contextIfTokenPresent(),
    ...opts,
  })
  return {getSessionByUserId, data, loading, error}
}
