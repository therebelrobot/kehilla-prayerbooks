import {uniq} from 'lodash'
import create from 'zustand'

// type definitions

export interface State {
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
  showHebrew: boolean
  toggleShowHebrew: () => void
  showTrans: boolean
  toggleShowTrans: () => void
  showEng: boolean
  toggleShowEng: () => void
  termReplace: {
    enable: boolean
    target: {
      en: string[]
      tr: string[]
      hb: string[]
    }
    replacement: {
      en: string
      tr: string
      hb: string
    }
  }
  toggleTermReplace: () => void
  editTermReplaceTargets: (
    type: keyof State['termReplace']['target'],
    targetStrings:
      | State['termReplace']['target']['en'][0]
      | State['termReplace']['target']['tr'][0]
      | State['termReplace']['target']['hb'][0]
  ) => void
  clearTermReplaceTargets: (type: keyof State['termReplace']['target']) => void
  updateTermReplaceReplacement: (
    type: keyof State['termReplace']['replacement'],
    replacementString:
      | State['termReplace']['replacement']['en'][0]
      | State['termReplace']['replacement']['tr'][0]
      | State['termReplace']['replacement']['hb'][0]
  ) => void
  clearTermReplaceReplacement: (type: keyof State['termReplace']['replacement']) => void
}

// defaults
const defaultSelectedFont = 'Spectral'
const defaultForceReload = false

// mutations

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
const toggleShowHebrew = (state: State) => {
  const newState = {...state}
  newState.showHebrew = !newState.showHebrew
  return newState
}
const toggleShowTrans = (state: State) => {
  const newState = {...state}
  newState.showTrans = !newState.showTrans
  return newState
}
const toggleShowEng = (state: State) => {
  const newState = {...state}
  newState.showEng = !newState.showEng
  return newState
}
const toggleTermReplace = (state: State) => {
  const newState = {...state}
  newState.termReplace.enable = !newState.termReplace.enable
  return newState
}
const editTermReplaceTargets = (
  type: keyof State['termReplace']['target'],
  targetString:
    | State['termReplace']['target']['en'][0]
    | State['termReplace']['target']['tr'][0]
    | State['termReplace']['target']['hb'][0],
  state: State
) => {
  const newState = {...state}
  newState.termReplace.target[type] = uniq(targetString.split(','))
  return newState
}
const removeTermReplaceTargets = (
  type: keyof State['termReplace']['target'],
  targetString:
    | State['termReplace']['target']['en'][0]
    | State['termReplace']['target']['tr'][0]
    | State['termReplace']['target']['hb'][0],
  state: State
) => {
  const newState = {...state}
  newState.termReplace.target[type] = targetString.split(',').map((t) => t.trim())
  return newState
}
const clearTermReplaceTargets = (type: keyof State['termReplace']['target'], state: State) => {
  const newState = {...state}
  newState.termReplace.target[type] = []
  return newState
}
const updateTermReplaceReplacement = (
  type: keyof State['termReplace']['replacement'],
  replacementString:
    | State['termReplace']['replacement']['en']
    | State['termReplace']['replacement']['tr']
    | State['termReplace']['replacement']['hb'],
  state: State
) => {
  const newState = {...state}
  newState.termReplace.replacement[type] = replacementString
  return newState
}
const clearTermReplaceReplacement = (
  type: keyof State['termReplace']['replacement'],
  state: State
) => {
  const newState = {...state}
  newState.termReplace.replacement[type] = ''
  return newState
}

// hooks
// this useStore hook is low-level, should be abstracted by
// specific selector hooks, as seen below
export const useStore = create(
  (set): State => ({
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
    showHebrew: true,
    showTrans: true,
    showEng: true,
    toggleShowHebrew: () => set((state: State) => toggleShowHebrew(state)),
    toggleShowTrans: () => set((state: State) => toggleShowTrans(state)),
    toggleShowEng: () => set((state: State) => toggleShowEng(state)),
    termReplace: {
      enable: false,
      target: {
        en: [],
        tr: [],
        hb: [],
      },
      replacement: {
        en: '',
        tr: '',
        hb: '',
      },
    },
    toggleTermReplace: () => set((state: State) => toggleTermReplace(state)),
    editTermReplaceTargets: (type, targetString) =>
      set((state: State) => editTermReplaceTargets(type, targetString, state)),
    clearTermReplaceTargets: (type) => set((state: State) => clearTermReplaceTargets(type, state)),
    updateTermReplaceReplacement: (type, replacementString) =>
      set((state: State) => updateTermReplaceReplacement(type, replacementString, state)),
    clearTermReplaceReplacement: (type) =>
      set((state: State) => clearTermReplaceReplacement(type, state)),
  })
)

// selector hooks

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

export const useFilters = () =>
  useStore((state: State) => ({
    showHebrew: state.showHebrew,
    showTrans: state.showTrans,
    showEng: state.showEng,
    toggleShowHebrew: state.toggleShowHebrew,
    toggleShowTrans: state.toggleShowTrans,
    toggleShowEng: state.toggleShowEng,
  }))
export const useTermReplace = () =>
  useStore((state: State) => ({
    termReplace: state.termReplace,
    toggleTermReplace: state.toggleTermReplace,
    editTermReplaceTargets: state.editTermReplaceTargets,
    clearTermReplaceTargets: state.clearTermReplaceTargets,
    updateTermReplaceReplacement: state.updateTermReplaceReplacement,
    clearTermReplaceReplacement: state.clearTermReplaceReplacement,
  }))
