import React, {FC} from 'react'

import NLink from 'next/link'
import {CgChevronLeftO} from 'react-icons/cg'
import {
    MdCancel, MdNewReleases, MdPauseCircleFilled, MdSwapVerticalCircle
} from 'react-icons/md'

import {
    Box, Heading as ChHeading, IconButton, List, Spacer
} from '@chakra-ui/react'
import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import Document from '@tiptap/extension-document'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import Mention from '@tiptap/extension-mention'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import {generateHTML} from '@tiptap/html'

import {useGetProseAndLines} from '_/services/Api/queries'

interface ShowPrayerProps {
  bookSlug: string
  sectionSlug: string
  prayerSlug: string
}

const statusIcons = {
  UNSTARTED: MdCancel,
  IN_PROGRESS: MdSwapVerticalCircle,
  STALLED: MdPauseCircleFilled,
  COMPLETE: MdNewReleases,
}
const statusColors = {
  UNSTARTED: 'gray',
  IN_PROGRESS: 'orange',
  STALLED: 'red',
  COMPLETE: 'green',
}

export const ShowPrayer: FC<ShowPrayerProps> = ({bookSlug, sectionSlug, prayerSlug}) => {
  const {loading, error, data, prose, lines, ordered} = useGetProseAndLines(
    bookSlug,
    sectionSlug,
    prayerSlug
  )

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {JSON.stringify(error)}</p>
  return (
    <>
      <ChHeading size="md" display="flex" flexDirection="row" alignItems="center">
        <NLink href={`/reading/${bookSlug}/${sectionSlug}`}>
          <IconButton
            icon={<CgChevronLeftO />}
            size="xs"
            aria-label={`return to ${data.prayerbooks[0].sections[0].name}`}
          />
        </NLink>
        <Spacer boxSize="8px" />
        {data.prayerbooks[0].sections[0].prayers[0].name}
      </ChHeading>
      <List spacing={3}>
        {prose.map((pr, index) => {
          if (!pr.tiptap_content) return null
          const content = generateHTML(pr.tiptap_content, [
            Document,
            Paragraph,
            Text,
            Bold,
            Heading,
            Image,
            Link,
            ListItem,
            BulletList,
            OrderedList,
            CodeBlock,
            Italic,
            Code,
            HorizontalRule,
            Blockquote,
            HardBreak,
            Strike,
            Table,
            Underline,
            TextAlign,
            Mention,
            Highlight,
            TextStyle,
            Superscript,
            Subscript,
            TableRow,
            TableCell,
            TableHeader,
          ])
          console.log(content, typeof content)
          return (
            <Box
              key={`prose-${index}`}
              className="ProseMirror"
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          )
        })}
      </List>
    </>
  )
}
