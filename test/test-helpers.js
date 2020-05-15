const bcrypt = require('bcrypt');

function makeUsersArray() {
    return [
      {
        full_name: 'Test user 1',
        email: 'email1@email.com',
        pw: 'password',
        date_created: now()
      },
      {
        full_name: 'Test user 2',
        email: 'email2@email.com',
        pw: 'password',
        date_created: now()
      },
      {
        full_name: 'Test user 3',
        email: 'email3@email.com',
        pw: 'password',
        date_created: now()
      },
      {
        full_name: 'Test user 4',
        email: 'email4@email.com',
        pw: 'password',
        date_created: now()
      },
    ]
  }
  
  function makeComediansArray() {
    return [
        {
            first_name: 'John',
            last_name: 'Smith',
            phone: '123-456-7890',
            email: 'johnsmith@email.com',
            bio: "This is a test bio for John Smith",
            notes: 'These are test notes for John Smith',
            category: 'open mic',
            gender: 'male',
            age: '30',
            race: 'white',
            passed: true,
            clean: true,
            ssn: '987-65-4321',
            street: '135 Maple Street',
            city: 'Asheville',
            st: 'NC',
            zip: '98765',
            website: 'www.johnsmithcomedy.com',
            facebook: 'www.facebook.com/johnsmithcomedy',
            twitter: 'www.twitter.com/jsmithcomedy',
            instagram: 'www.instagram.com/jsmithcomedy',
        },
        {
            first_name: 'Harper',
            last_name: 'Noelle',
            phone: '654-321-9876',
            email: 'harpernoelle@email.com',
            bio: "This is a test bio for Harper Noelle",
            notes: 'These are test notes for Harper Noelle',
            category: 'open mic',
            gender: 'female',
            age: '32',
            race: 'white',
            passed: true,
            clean: true,
            ssn: '876-78-5432',
            street: '7654 Second Ave',
            city: 'Manhattan',
            st: 'NY',
            zip: '54367',
            website: 'www.harpernoellestandup.com',
            facebook: 'www.facebook.com/harpernoellestandup',
            twitter: 'www.twitter.com/hnoelle',
            instagram: 'www.instagram.com/hnoelle',
        }
    ]
}
  
  function makeExpectedComedian(users, comedians=[]) {
    const author = users
      .find(user => user.id === comedian.id)
  
    const number_of_comments = comments
      .filter(comment => comment.article_id === article.id)
      .length
  
    return {
      title: sighting.title,
      species: sighting.species,
      brief_description: sighting.brief_description,
      detailed_description: sighting.detailed_description,
      sighting_date: sighting.sighting_date,
      sighting_location: sighting.sighting_location
    }
  }
  
  function makeMaliciousComedian(user) {
    const maliciousComedian = {
      first_name: 'I am malicious<script>alert("xss");</script>',
      last_name: 'Question',
      phone: 'What kind of bear is best',
      email: 'False',
      bio: 'Black Bear',
      notes: 'Bears',
      category: 'Beets',
      gender: 'Battlestar',
      age: 'Galactica',
      race: 'MICHAEL',
      passed: 'MICHAEL',
      clean: true,
      ssn: '123-45-1234',
      street: '000 Bad Boulevard',
      city: 'Bad Place',
      st: 'NO',
      zip: '12345',
      website: `Bears, Beets, Battlestar Galactica onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
      facebook: 'www.facebook.com/badbadbad',
      twitter: 'www.twitter.com/badnewsbears',
      instagram: 'www.instagram.com/badnewsbears'
    }
    const expectedComedian = {
      ...makeExpectedComedian([user], maliciousComedian),
      first_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      bio: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    }
    return {
      maliciousComedian,
      expectedComedian,
    }
  }
  
  function makeComediansFixtures() {
    const testUsers = makeUsersArray()
    const testComedians = makeComediansArray(testUsers)
    return { testUsers, testComedians }
  }

  function seedUsers(db, users) {
      const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
      }))
      return db.into('users').insert(preppedUsers)
        .then(() => {})
          /*// update the auto sequence to stay in sync
          db.raw(
            `SELECT setval('user_id', ?)`,
            users.length,
          )
        )*/
    }
  
  // function cleanTables(db) {
  //   return db.transaction(trx =>
  //     trx.raw(
  //       `TRUNCATE
  //         users,
  //         comedian
  //       `
  //     )
  //     .then(() =>
  //       Promise.all([
  //         trx.raw(`ALTER SEQUENCE comedian_id_seq minvalue 0 START WITH 1`),
  //         trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
  //         trx.raw(`SELECT setval('comedian_id_seq', 0)`),
  //         trx.raw(`SELECT setval('users_id_seq', 0)`),
  //       ])
  //     )
  //   )
  // }
  
  function seedComedianTables(db, users, comedians=[]) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await trx.into('users').insert(users)
      await trx.into('comedian').insert(comedians)
      // update the auto sequence to match the forced id values
      await Promise.all([
        trx.raw(
          `SELECT setval('user_id_seq', ?)`,
          [users[users.length - 1].id],
        ),
        trx.raw(
          `SELECT setval('comedian_id_seq', ?)`,
          [comedians[comedians.length - 1].id],
        ),
      ])
    })
  }
  
  function seedMaliciousComedian(db, user, comedian) {
    return db
      .into('comedian')
      .insert([user])
      .then(() =>
        db
          .into('comedian')
          .insert([comedian])
      )
  }
  
  module.exports = {
    makeUsersArray,
    makeComediansArray,
    makeExpectedComedian,
    makeMaliciousComedian,
  
    makeComediansFixtures,
    // cleanTables,
    seedUsers,
    seedComedianTables,
    seedMaliciousComedian,
  }