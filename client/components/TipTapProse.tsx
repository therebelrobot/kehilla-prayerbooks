import React from 'react'

import {CgArrowsBreakeV} from 'react-icons/cg'
import {
    MdClear, MdClearAll, MdCode, MdFormatBold, MdFormatItalic, MdFormatQuote,
    MdRedo, MdStrikethroughS, MdUndo
} from 'react-icons/md'
import {VscHorizontalRule} from 'react-icons/vsc'
import {throttle} from 'throttle-debounce'

import {IconButton} from '@chakra-ui/react'
import {
    RiCodeBoxLine, RiH1, RiH2, RiH3, RiH4, RiH5, RiH6, RiListOrdered,
    RiListUnordered, RiParagraph
} from '@hacknug/react-icons/ri'
import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import {useInsertProse, useUpdateProse} from '_/services/Api/queries'
import {useEditing, useStore} from '_/services/state'

const MenuBar = ({editor}) => {
  if (!editor) {
    return null
  }

  return (
    <>
      <IconButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        icon={<MdFormatBold />}
        aria-label="bold"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        icon={<MdFormatItalic />}
        aria-label="italic"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
        icon={<MdStrikethroughS />}
        aria-label="strike"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
        icon={<MdCode />}
        aria-label="code"
      />
      <IconButton
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        icon={<MdClear />}
        aria-label="clear marks"
      />
      <IconButton
        onClick={() => editor.chain().focus().clearNodes().run()}
        icon={<MdClearAll />}
        aria-label="clear nodes"
      />
      <IconButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
        icon={<RiParagraph />}
        aria-label="paragraph"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
        className={editor.isActive('heading', {level: 1}) ? 'is-active' : ''}
        icon={<RiH1 />}
        aria-label="h1"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
        className={editor.isActive('heading', {level: 2}) ? 'is-active' : ''}
        icon={<RiH2 />}
        aria-label="h2"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
        className={editor.isActive('heading', {level: 3}) ? 'is-active' : ''}
        icon={<RiH3 />}
        aria-label="h3"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({level: 4}).run()}
        className={editor.isActive('heading', {level: 4}) ? 'is-active' : ''}
        icon={<RiH4 />}
        aria-label="h4"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({level: 5}).run()}
        className={editor.isActive('heading', {level: 5}) ? 'is-active' : ''}
        icon={<RiH5 />}
        aria-label="h5"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({level: 6}).run()}
        className={editor.isActive('heading', {level: 6}) ? 'is-active' : ''}
        icon={<RiH6 />}
        aria-label="h6"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
        icon={<RiListUnordered />}
        aria-label="bullet list"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
        icon={<RiListOrdered />}
        aria-label="ordered list"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
        icon={<RiCodeBoxLine />}
        aria-label="code block"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
        icon={<MdFormatQuote />}
        aria-label="blockquote"
      />

      <IconButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        aria-label="horizontal rule"
        icon={<VscHorizontalRule />}
      />
      <IconButton
        onClick={() => editor.chain().focus().setHardBreak().run()}
        icon={<CgArrowsBreakeV />}
        aria-label="hard break"
      />
      <IconButton
        onClick={() => editor.chain().focus().undo().run()}
        icon={<MdUndo />}
        aria-label="undo"
      />
      <IconButton
        onClick={() => editor.chain().focus().redo().run()}
        icon={<MdRedo />}
        aria-label="redo"
      />
    </>
  )
}

export const TipTapProse = ({content, prayerId}) => {
  const {activeEditId, setActiveEditId} = useEditing()
  const {insertProse, loading: insertLoading} = useInsertProse()
  const {updateProse, loading: updateLoading} = useUpdateProse()
  console.log(activeEditId)
  const onUpdate = (json) => {
    if (insertLoading || updateLoading) return
    const {activeEditId: directId} = useStore.getState()
    if (directId) {
      console.log('updateProse')
      const variables = {tiptap_content: json, prayer_id: prayerId, id: directId}
      updateProse({variables})
      return
    }

    console.log('insertProse', activeEditId)
    const variables = {tiptap_content: json, prayer_id: prayerId}
    insertProse({variables}).then((data) => {
      console.log({data})
      if (data.data.insert_prose) {
        console.log('insert', data.data.insert_prose.returning[0].id)
        setActiveEditId(data.data.insert_prose.returning[0].id)
        return
      }
      console.log('update')
    })
  }

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: throttle(2000, ({editor}) => {
      const json = editor.getJSON()
      onUpdate(json)
      // send the content to an API here
    }),
  })

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
