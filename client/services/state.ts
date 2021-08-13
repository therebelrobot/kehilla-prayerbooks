import create from 'zustand'

// type definitions

export interface State {
  friendName: string
  fancyFriendName: string
  updateFriendName: (name: string) => void
}

// defaults
const defaultFriendName = 'world'
const defaultFancyFriendName = `✨ ${defaultFriendName} ✨`

// mutations
const updateFriendName = (newName: State['friendName'], state: State) => {
  const newState = {...state}
  newState.friendName = newName
  newState.fancyFriendName = `✨ ${newName} ✨`
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
