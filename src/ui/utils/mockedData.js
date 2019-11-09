
export const bookmarks = [
  {
    id: '8lV4wDBOkvfI',
    title: 'Startpage',
    index: 9,
    dateAdded: 1558198187734,
    type: 'folder',
    dateGroupModified: 1558198260409,
    children: [
      {
        id: '0QuEqVxp3bNi',
        title: 'Social media',
        index: 0,
        dateAdded: 1558198221904,
        type: 'folder',
        parentId: '8lV4wDBOkvfI',
        dateGroupModified: 1558198237512,
        children: [
          {
            id: 'sfg1ag773vbn',
            title: 'Subfolder',
            index: 0,
            dateAdded: 1558198221904,
            type: 'folder',
            parentId: '0QuEqVxp3bNi',
            dateGroupModified: 1558198237512,
            children: [
              {
                id: 'NaDhe43yrsdf',
                title: 'Blocket',
                index: 1,
                dateAdded: 1558198231672,
                type: 'bookmark',
                url: 'https://www.blocket.se/',
                parentId: 'sfg1ag773vbn',
              },
            ],
          },
          {
            id: 'KDkBZVAr3xKT',
            title: 'Facebook',
            index: 1,
            dateAdded: 1558198212478,
            type: 'bookmark',
            url: 'https://www.facebook.com/',
            parentId: '0QuEqVxp3bNi',
          },
          {
            id: 'KcDDZPyQBlfQ',
            title: 'Instagram',
            index: 2,
            dateAdded: 1558198231672,
            type: 'bookmark',
            url: 'https://www.instagram.com/',
            parentId: '0QuEqVxp3bNi',
          },
        ],
      },
      {
        id: 'G0LN2Wnl-olu',
        title: 'Lobsters',
        index: 1,
        dateAdded: 1558198207458,
        type: 'bookmark',
        url: 'https://lobste.rs/',
        parentId: '8lV4wDBOkvfI',
      },
      {
        id: 'i8LRgU-nSj4A',
        title: 'Hacker News',
        index: 2,
        dateAdded: 1558198256362,
        type: 'bookmark',
        url: 'https://news.ycombinator.com/',
        parentId: '8lV4wDBOkvfI',
      },
    ],
    parentId: 'unfiled_____',
  },
]

export const rootBookmarks = [
  {
    id: 'root________',
    title: '',
    index: 0,
    dateAdded: 1515318576153,
    type: 'folder',
    dateGroupModified: 1571599293496,
    children: [
      {
        id: 'oiVdXG7R',
        title: 'News',
        index: 0,
        dateAdded: 1558198187734,
        type: 'folder',
        dateGroupModified: 1558198260409,
        children: [
          {
            id: 'WM7h5soF',
            title: 'The Guardian',
            index: 1,
            dateAdded: 1558198207458,
            type: 'bookmark',
            url: 'https://www.theguardian.com',
            parentId: 'oiVdXG7R',
          },
        ],
        parentId: 'root________',
      },
      bookmarks[0],
    ],
  },
]

export const store = {
  // bookmarkFolderId: '8lV4wDBOkvfI',
  'favicon_url_i8LRgU-nSj4A': 'https://news.ycombinator.com/favicon.ico',
  'favicon_url_G0LN2Wnl-olu': 'https://lobste.rs/apple-touch-icon-144.png',
  favicon_url_KDkBZVAr3xKT: 'http://www.facebook.com/apple-touch-icon-precomposed.png',
  favicon_url_NaDhe43yrsdf: 'https://www.blocket.se/apple-touch-icon-144x144.png',
}