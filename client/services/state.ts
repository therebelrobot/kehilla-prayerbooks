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
