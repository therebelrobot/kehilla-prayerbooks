import {Box, ButtonGroup, IconButton} from '@chakra-ui/react'
import {
  RiCodeBoxLine,
  RiH1,
  RiH2,
  RiH3,
  RiH4,
  RiH5,
  RiH6,
  RiListOrdered,
  RiListUnordered,
  RiParagraph,
} from '@hacknug/react-icons/ri'
import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, {useCallback} from 'react'
import {CgArrowsBreakeV} from 'react-icons/cg'
import {
  MdClear,
  MdClearAll,
  MdCode,
  MdFormatBold,
  MdFormatItalic,
  MdFormatQuote,
  MdRedo,
  MdStrikethroughS,
  MdUndo,
} from 'react-icons/md'
import {VscHorizontalRule} from 'react-icons/vsc'
import {throttle} from 'throttle-debounce'
import {useInsertProse, useUpdateProse} from '_/services/Api/queries'
import {useEditing, useStore} from '_/services/state'

const MenuBar = ({editor}) => {
  if (!editor) {
    return null
  }

  return (
    <>
      <ButtonGroup
        size="sm"
        isAttached
        variant="outline"
        width="100%"
        borderWidth="1px"
        borderTopRadius="8px"
        borderBottomWidth="0"
        height="auto"
      >
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          icon={<MdFormatBold />}
          aria-label="bold"
          name="bold"
          mr="-px"
          borderTopLeftRadius="8px"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          icon={<MdFormatItalic />}
          aria-label="italic"
          name="italic"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          icon={<MdStrikethroughS />}
          aria-label="strike"
          name="strike"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'is-active' : ''}
          icon={<MdCode />}
          aria-label="code"
          name="code"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          icon={<MdClear />}
          aria-label="clear marks"
          name="clear marks"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().clearNodes().run()}
          icon={<MdClearAll />}
          aria-label="clear nodes"
          name="clear nodes"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
          icon={<RiParagraph />}
          aria-label="paragraph"
          name="paragraph"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
          className={editor.isActive('heading', {level: 1}) ? 'is-active' : ''}
          icon={<RiH1 />}
          aria-label="h1"
          name="h1"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
          className={editor.isActive('heading', {level: 2}) ? 'is-active' : ''}
          icon={<RiH2 />}
          aria-label="h2"
          name="h2"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
          className={editor.isActive('heading', {level: 3}) ? 'is-active' : ''}
          icon={<RiH3 />}
          aria-label="h3"
          name="h3"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleHeading({level: 4}).run()}
          className={editor.isActive('heading', {level: 4}) ? 'is-active' : ''}
          icon={<RiH4 />}
          aria-label="h4"
          name="h4"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleHeading({level: 5}).run()}
          className={editor.isActive('heading', {level: 5}) ? 'is-active' : ''}
          icon={<RiH5 />}
          aria-label="h5"
          name="h5"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleHeading({level: 6}).run()}
          className={editor.isActive('heading', {level: 6}) ? 'is-active' : ''}
          icon={<RiH6 />}
          aria-label="h6"
          name="h6"
          mr="-px"
          borderTopRightRadius="8px"
          borderBottomRightRadius="8px"
        />
      </ButtonGroup>
      <ButtonGroup
        size="sm"
        isAttached
        variant="outline"
        borderLeftWidth="1px"
        borderRightWidth="1px"
        width="100%"
      >
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          icon={<RiListUnordered />}
          aria-label="bullet list"
          name="bullet list"
          mr="-px"
          mt="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          icon={<RiListOrdered />}
          aria-label="ordered list"
          name="ordered list"
          mt="-px"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
          icon={<RiCodeBoxLine />}
          aria-label="code block"
          name="code block"
          mt="-px"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          icon={<MdFormatQuote />}
          aria-label="blockquote"
          name="blockquote"
          mt="-px"
          mr="-px"
        />

        <IconButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          aria-label="horizontal rule"
          name="horizontal rule"
          mt="-px"
          mr="-px"
          icon={<VscHorizontalRule />}
        />
        <IconButton
          onClick={() => editor.chain().focus().setHardBreak().run()}
          icon={<CgArrowsBreakeV />}
          aria-label="hard break"
          name="hard break"
          mt="-px"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={<MdUndo />}
          aria-label="undo"
          name="undo"
          mt="-px"
          mr="-px"
        />
        <IconButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={<MdRedo />}
          aria-label="redo"
          name="redo"
          mt="-px"
          mr="-px"
          borderBottomRightRadius="8px"
        />
      </ButtonGroup>
    </>
  )
}

export const TipTapProse = ({content, prayerId, id, bookSlug, sectionSlug, prayerSlug}) => {
  const {activeEditId, setActiveEditId} = useEditing()
  const {insertProse, loading: insertLoading} = useInsertProse(bookSlug, sectionSlug, prayerSlug)
  const {updateProse, loading: updateLoading} = useUpdateProse(bookSlug, sectionSlug, prayerSlug)
  console.log({activeEditId, id})
  const onUpdate = useCallback(
    (json) => {
      if (insertLoading || updateLoading) return
      const {activeEditId: directId} = useStore.getState()
      console.log({directId, id})
      if (directId || id) {
        console.log('updateProse')
        const variables = {tiptap_content: json, id: id || directId}
        updateProse({variables})
        return
      }

      console.log('insertProse', activeEditId)
      const variables = {tiptap_content: json}
      insertProse({variables}).then((data) => {
        console.log({data})
        if (data.data.insert_prose) {
          console.log('insert', data.data.insert_prose.returning[0].id)
          setActiveEditId(data.data.insert_prose.returning[0].id)
          return
        }
        console.log('update')
      })
    },
    [insertLoading, updateLoading, id, activeEditId, updateProse, insertProse, setActiveEditId]
  )

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onBlur: () => {
      setActiveEditId(null)
    },
    onUpdate: throttle(2000, ({editor}) => {
      const json = editor.getJSON()
      onUpdate(json)
      // send the content to an API here
    }),
  })

  return (
    <Box marginTop="0 !important">
      <MenuBar editor={editor} />
      <Box p="16px" borderWidth="1px" borderTopWidth="0" borderBottomRadius="8px">
        <EditorContent editor={editor} />
      </Box>
    </Box>
  )
}
