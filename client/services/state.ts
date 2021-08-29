import create from 'zustand'

// type definitions

export interface State {
  friendName: string
  fancyFriendName: string
  updateFriendName: (newName: State['friendName']) => void
  selectedFont: 'Spectral'
  updateSelectedFont: (newFont: State['selectedFont']) => void
  reload: boolean
  forceReload: () => void
  activeEditId: number | null
  setActiveEditId: (id: State['activeEditId']) => void
  startedSessionId: string | null
  joinedSessionId: string | null
  updateStartedSessionId: (id: State['startedSessionId']) => void
  updateJoinedSessionId: (id: State['joinedSessionId']) => void
  sessionPaused: boolean
  setSessionPaused: (isPaused: State['sessionPaused']) => void
  matchingSnippet: string | null
  setMatchingSnippet: (snippet: State['matchingSnippet']) => void
  readerId: string | null
  setReaderId: (id: State['readerId']) => void
}

// defaults
const defaultFriendName = 'world'
const defaultFancyFriendName = `✨ ${defaultFriendName} ✨`
const defaultSelectedFont = 'Spectral'
const defaultForceReload = false

// mutations
const updateFriendName = (newName: State['friendName'], state: State) => {
  const newState = {...state}
  newState.friendName = newName
  newState.fancyFriendName = `✨ ${newName} ✨`
  return newState
}

const updateSelectedFont = (newFont: State['selectedFont'], state: State) => {
  const newState = {...state}
  newState.selectedFont = newFont
  return newState
}
const forceReload = (state: State) => {
  const newState = {...state}
  newState.reload = !state.reload
  return newState
}

const updateActiveEditId = (id: State['activeEditId'], state: State) => {
  const newState = {...state}
  newState.activeEditId = id
  return newState
}
const updateStartedSessionId = (id: State['startedSessionId'], state: State) => {
  const newState = {...state}
  newState.startedSessionId = id
  return newState
}
const updateJoinedSessionId = (id: State['joinedSessionId'], state: State) => {
  const newState = {...state}
  newState.joinedSessionId = id
  return newState
}
const updateSessionPaused = (isPaused: State['sessionPaused'], state: State) => {
  const newState = {...state}
  newState.sessionPaused = isPaused
  return newState
}
const updateMatchingSnippet = (snippet: State['matchingSnippet'], state: State) => {
  const newState = {...state}
  newState.matchingSnippet = snippet
  return newState
}
const setReaderId = (id: State['readerId'], state: State) => {
  const newState = {...state}
  newState.readerId = id
  return newState
}

// selectors
const getFriendName = (state: State) => state.friendName
const getFancyFriendName = (state: State) => state.fancyFriendName

// hooks
// this useStore hook is low-level, should be abstracted by
// specific selector hooks, as seen below
export const useStore = create(
  (set): State => ({
    friendName: defaultFriendName,
    fancyFriendName: defaultFancyFriendName,
    updateFriendName: (newName: string) => set((state: State) => updateFriendName(newName, state)),
    selectedFont: defaultSelectedFont,
    updateSelectedFont: (newFont: State['selectedFont']) =>
      set((state: State) => updateSelectedFont(newFont, state)),
    reload: defaultForceReload,
    forceReload: () => set((state: State) => forceReload(state)),
    activeEditId: null,
    setActiveEditId: (id: State['activeEditId']) =>
      set((state: State) => updateActiveEditId(id, state)),
    startedSessionId: null,
    joinedSessionId: null,
    updateStartedSessionId: (id: State['startedSessionId']) =>
      set((state: State) => updateStartedSessionId(id, state)),
    updateJoinedSessionId: (id: State['joinedSessionId']) =>
      set((state: State) => updateJoinedSessionId(id, state)),
    sessionPaused: false,
    setSessionPaused: (isPaused: State['sessionPaused']) =>
      set((state: State) => updateSessionPaused(isPaused, state)),
    matchingSnippet: null,
    setMatchingSnippet: (snippet: State['matchingSnippet']) =>
      set((state: State) => updateMatchingSnippet(snippet, state)),
    readerId: null,
    setReaderId: (id: State['readerId']) => set((state: State) => setReaderId(id, state)),
  })
)

// selector hooks
export const useFriendName = () =>
  useStore((state: State) => ({
    friendName: state.friendName,
    fancyFriendName: state.fancyFriendName,
    updateFriendName: state.updateFriendName,
    getFriendName: () => getFriendName(state),
    getFancyFriendName: () => getFancyFriendName(state),
  }))

export const useFont = () =>
  useStore((state: State) => ({
    selectedFont: state.selectedFont,
    updateSelectedFont: state.updateSelectedFont,
  }))

export const useReload = () =>
  useStore((state: State) => ({
    reload: state.reload,
    forceReload: state.forceReload,
  }))

export const useEditing = () =>
  useStore((state: State) => ({
    activeEditId: state.activeEditId,
    setActiveEditId: state.setActiveEditId,
  }))

export const useReadingSession = () =>
  useStore((state: State) => ({
    startedSessionId: state.startedSessionId,
    joinedSessionId: state.joinedSessionId,
    updateStartedSessionId: state.updateStartedSessionId,
    updateJoinedSessionId: state.updateJoinedSessionId,
    sessionPaused: state.sessionPaused,
    setSessionPaused: state.setSessionPaused,
    matchingSnippet: state.matchingSnippet,
    setMatchingSnippet: state.setMatchingSnippet,
    readerId: state.readerId,
    setReaderId: state.setReaderId,
  }))
