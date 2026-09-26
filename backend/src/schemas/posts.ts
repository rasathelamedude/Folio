import { t } from "elysia";

export const PostInsertSchema = t.Object({
  kind: t.String(),
  id: t.String(),
  etag: t.String(),
  selfLink: t.String(),

  volumeInfo: t.Object({
    title: t.String(),
    subtitle: t.Optional(t.String()),
    authors: t.Array(t.String()),
    publisher: t.Optional(t.String()),
    publishedDate: t.String(),
    description: t.String(),

    industryIdentifiers: t.Array(
      t.Object({
        type: t.String(),
        identifier: t.String(),
      }),
    ),

    readingModes: t.Object({
      text: t.Boolean(),
      image: t.Boolean(),
    }),

    pageCount: t.Number(),
    printType: t.String(),
    categories: t.Optional(t.Array(t.String())),
    averageRating: t.Optional(t.Number()),
    ratingsCount: t.Optional(t.Number()),
    maturityRating: t.String(),
    allowAnonLogging: t.Boolean(),
    contentVersion: t.String(),

    panelizationSummary: t.Optional(
      t.Object({
        containsEpubBubbles: t.Boolean(),
        containsImageBubbles: t.Boolean(),
      }),
    ),

    imageLinks: t.Optional(
      t.Object({
        smallThumbnail: t.String(),
        thumbnail: t.String(),
      }),
    ),

    language: t.String(),
    previewLink: t.String(),
    infoLink: t.String(),
    canonicalVolumeLink: t.String(),
  }),

  saleInfo: t.Object({
    country: t.String(),
    saleability: t.String(),
    isEbook: t.Boolean(),
  }),

  accessInfo: t.Object({
    country: t.String(),
    viewability: t.String(),
    embeddable: t.Boolean(),
    publicDomain: t.Boolean(),
    textToSpeechPermission: t.String(),

    epub: t.Object({
      isAvailable: t.Boolean(),
      acsTokenLink: t.Optional(t.String()),
    }),

    pdf: t.Object({
      isAvailable: t.Boolean(),
    }),

    webReaderLink: t.String(),
    accessViewStatus: t.String(),
    quoteSharingAllowed: t.Boolean(),
  }),

  searchInfo: t.Optional(
    t.Object({
      textSnippet: t.String(),
    }),
  ),
});
