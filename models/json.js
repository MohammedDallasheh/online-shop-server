[
  {
    'repeat(100)': {
      _id: '{{index()}}',
      user: '{{integer(0, 9)}}',
      index: '{{index()}}',
      price: '{{integer(50,500)}}',
      offer: function (tags) {
        return this.price * tags.floating(0, 1, 2);
      },
      stock: '{{integer(0, 100)}}',
      sold: '{{integer(0, 100)}}',
      rate: '{{integer(0, 5)}}',
      title: '{{lorem(1, "sentences")}}',
      createdAt: '{{date()}}',
      updatedAt: '{{date()}}',
      description: '{{lorem(1, "paragraphs")}}',
      tags: [
        {
          'repeat(0,3)': {
            name:
              '{{random("Sales", "Specials", "Hot", "Trends", "New")}}',
            untilDate: '{{date(new Date(2021, 3, 1))}}',
          },
        },
      ],
      location: [
        {
          'repeat(1,5)':
            '{{random("loc1","loc2","loc3","loc4","loc5","loc6","loc7","loc8","loc9","loc10")}}',
        },
      ],
      category: '{{integer(0, 10)}}',
      subs: [{ 'repeat(2,7)': '{{integer(0, 29)}}' }],
      relatedProduct: [{ 'repeat(5,7)': '{{integer(0, 180)}}' }],
      imgs: [
        {
          'repeat(3,5)': {
            url: function (tags) {
              return './img/' + tags.integer(1, 20) + '.jpg';
            },
            alt: function (tags) {
              return (
                tags.lorem(1, 'word') +
                ' ' +
                tags.lorem(1, 'word') +
                ' ' +
                tags.lorem(1, 'word')
              );
            },
          },
        },
      ],
      orders: [
        {
          orderId: [{ 'repeat(1,5)': '{{integer(0, 100)}}' }],
          buyerId: { type: ObjectId, ref: 'user' },
          rate: {
            type: Number,
            enum: [0, 1, 2, 3, 4, 5],
          },
          createdAt: { type: Date, default: Date.now() },
        },
      ],
      reviews: [
        {
          userId: { type: ObjectId, ref: 'user' },
          name: String,
          avatar: String,
          createdAt: { type: Date, default: Date.now() },
          text: String,
        },
      ],
      review: {
        usersRate: [
          {
            'repeat(0,20)': {
              userId: '{{integer(0, 10)}}',
              rate: '{{integer(0, 5)}}',
              createdAt: '{{date()}}',
            },
          },
        ],
        usersReviews: [
          {
            'repeat(0,4)': {
              userId: '{{integer(0, 10)}}',
              name: '{{firstName()}} {{surname()}}',
              createdAt: '{{date()}}',
              updatedAt: '{{date()}}',
              text: '{{lorem(1, "sentences")}}',
            },
          },
        ],
      },
    },
  },
];
