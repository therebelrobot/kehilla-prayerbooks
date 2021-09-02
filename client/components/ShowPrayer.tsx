import React, {FC} from 'react'

import NLink from 'next/link'
import {CgChevronLeftO} from 'react-icons/cg'

import {
    Box, Container, Heading as ChHeading, IconButton, List, Spacer,
    Text as ChText
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

import {SessionUpdater} from '_/components/SessionUpdater'
import {useGetProseAndLines} from '_/services/Api/queries'
import {useFilters} from '_/services/state'

interface ShowPrayerProps {
  bookSlug: string
  sectionSlug: string
  prayerSlug: string
}

export const ShowPrayer: FC<ShowPrayerProps> = ({bookSlug, sectionSlug, prayerSlug}) => {
  const {loading, error, data, prayer, prose, lines, ordered} = useGetProseAndLines(
    bookSlug,
    sectionSlug,
    prayerSlug
  )
  const {showHebrew, showTrans, showEng} = useFilters()
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {JSON.stringify(error)}</p>

  const singlePage = prayer.from_page === prayer.to_page

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
        <Spacer boxSize="8px" flexShrink={0} />
        {data.prayerbooks[0].sections[0].prayers[0].name}
      </ChHeading>
      <br />
      <ChHeading size="xs" opacity={0.55}>
        PDF page{singlePage ? '' : 's'} {prayer.from_page}
        {singlePage ? '' : ` - ${prayer.to_page}`}
      </ChHeading>
      <Box height="32px" width="100%" flexShrink={0} />

      <Container maxW="100%">
        <List spacing={3}>
          {ordered.map((item, index) => {
            if (item.type === 'prose') {
              if (!item.tiptap_content) return null
              const content = generateHTML(item.tiptap_content, [
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
                <SessionUpdater id={item.id} type="prose">
                  <Container>
                    <Box
                      key={`prose-${item.id}`}
                      className="ProseMirror"
                      dangerouslySetInnerHTML={{
                        __html: content,
                      }}
                    />
                  </Container>
                </SessionUpdater>
              )
            } else if (item.type === 'line') {
              return (
                <SessionUpdater id={item.id} type="line" width="100%">
                  <Box
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    borderBottomWidth={{base: '1px', md: 0, lg: 0, xl: 0}}
                  >
                    <Box
                      width="100%"
                      display="flex"
                      flexDirection={{base: 'column', md: 'row', lg: 'row', xl: 'row'}}
                      alignItems="center"
                      justifyContent="space-between"
                      flexWrap="wrap"
                    >
                      {showHebrew && (
                        <>
                          <Box
                            mb={{base: '8px', md: 0, lg: 0, xl: 0}}
                            w={{base: '100%', md: 'auto', lg: 'auto', xl: 'auto'}}
                            display="flex"
                            flex={1}
                            flexDirection="row"
                            justifyContent="flex-end"
                          >
                            {!!item.hebrew.length ? (
                              <ChText className="hebrew" display="block" dir="rtl">
                                {item.hebrew}
                              </ChText>
                            ) : (
                              <ChText fontSize="10px" as="i" opacity={0.55}>
                                No Hebrew Available
                              </ChText>
                            )}
                          </Box>
                          <Box width="16px" flexShrink={0} />
                        </>
                      )}
                      {showTrans && (
                        <>
                          <Box
                            w={{base: '100%', md: 'auto', lg: 'auto', xl: 'auto'}}
                            mb={{base: '8px', md: 0, lg: 0, xl: 0}}
                            display="flex"
                            flex={1}
                            flexDirection="row"
                            justifyContent={
                              showHebrew ? 'flex-start' : showEng ? 'flex-end' : 'center'
                            }
                            textAlign={showHebrew ? 'left' : showEng ? 'right' : 'center'}
                          >
                            {!!item.transliteration.length ? (
                              <ChText as="strong">{item.transliteration}</ChText>
                            ) : (
                              <ChText fontSize="10px" as="i" opacity={0.55}>
                                No Transliteration Available
                              </ChText>
                            )}
                          </Box>
                          <Box width="16px" flexShrink={0} />
                        </>
                      )}
                      {showEng && (
                        <Box
                          w={{base: '100%', md: 'auto', lg: 'auto', xl: 'auto'}}
                          mb={{base: '8px', md: 0, lg: 0, xl: 0}}
                          display="flex"
                          flex={1}
                          flexDirection="row"
                          justifyContent={showHebrew || showTrans ? 'flex-start' : 'center'}
                        >
                          {!!item.translation.length ? (
                            <ChText>{item.translation}</ChText>
                          ) : (
                            <ChText fontSize="10px" as="i" opacity={0.55}>
                              No English Translation Available
                            </ChText>
                          )}
                        </Box>
                      )}
                    </Box>
                    {!!item.notes.length && (
                      <Box width="100%" display="flex" flexDirection="row" justifyContent="center">
                        <ChText fontSize="sm" as="i">
                          {item.notes}
                        </ChText>
                      </Box>
                    )}
                  </Box>
                </SessionUpdater>
              )
            }
            return null
          })}
        </List>
      </Container>
    </>
  )
}
