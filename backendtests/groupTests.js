const { expect } = require('chai');
const request = require('supertest');
const app = require('../index.js');
const groupDB = require('../database_tools/group_db.js'); // Import your groupDB module

describe('Group tests', function() {
  //Gets all groups
    it('Get all groups', async function() {
        try {
            const res = await request(app)
              .get('/groups/all')
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.have.property('message', 'All groups retrieved successfully');
            expect(res.body).to.have.property('groups');

        } catch (error) {
            console.error(error);
            throw error; 
        }
    });
    //Gets a single group by id
    it('Getting a single group by id.', async function() {
        const groupIdToGet  = 187;
        try {
            const res = await request(app)
              .get('/groups/all/' + groupIdToGet)
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.have.property('message', 'Group retrieved successfully');
            expect(res.body).to.have.property('group');

            const group = res.body.group;

            expect(group).to.have.property('idgroup', groupIdToGet);
            expect(group).to.have.property('groupname', 'testitesti');
            expect(group).to.have.property('groupdescription', 'juu');

        } catch (error) {
            console.error(error);
            throw error; 
        }
    });
    //Attempt to get a group by and id that doesn't exist. Produces an error
    it('Getting a group by id that doest exist. Returns an error.', async function() {
        const nonExistantGroupId = 1;
        const res = await request(app)
            .get('/groups/all/'+ nonExistantGroupId)
            .expect(404);
    });
    // This is needed for deletion of the group created in the following test
    let createdGroupId;
    //Creates a new group
    it('Creating a new group', async function () {
        try {
            const newGroupData = {
              groupName: 'NewTestGroup',
              idowner: 44,
              description: 'Test group description',
              groupsettings: JSON.stringify({ "shownews": true })
            };
      
            const res = await request(app)
              .post('/groups/create')
              .send(newGroupData)
              .expect(201);
      
            expect(res.body).to.have.property('message', 'Group created successfully');
            expect(res.body).to.have.property('group');
            expect(res.body.group).to.have.property('idgroup');
            expect(res.body.group).to.have.property('idowner');
            expect(res.body.group).to.have.property('groupname');
            expect(res.body.group).to.have.property('groupdescription');
      
            //Stores the test group id for further use
            createdGroupId = res.body.group.idgroup;
      
        } catch (error) {
            console.error(error);
            throw error;
          }
    });
    //Attempts to create a group with a name that already exists. Produces an error
    it('Create a group with a name that already exists. Returns an error.', async function() {
        const newGroupData = {
          groupName: 'NewTestGroup',
          idowner: 44,
          description: 'Test group description',
          groupsettings: JSON.stringify({ "shownews": true })
        };
        const res = await request(app)
            .post('/groups/create')
            .send(newGroupData)
            .expect(400);
    });
    //Adds the owner as a member to give viewing access to the group
    it('Adds the owner as a member', async function () {
      try {
          const groupId = createdGroupId;
          const addOwnerResponse = await request(app)
              .post(`/members/${groupId}/add-owner-as-member`)
              .send({ userId: 44 })
              .expect(201);

      } catch (error) {
          console.error(error);
          throw error;
      }
  });
    //Adds a pending member to the previously created group
    it('Adds a new member to a group with acceptedPool set to false', async function () {
          const groupId = createdGroupId;
          const userId = 49
          const sendJoinRequest = {
            groupId: createdGroupId,
            userId: userId
          }
        try {
            const response = await request(app)
                .post(`/groups/${groupId}/add-member`)
                .send( sendJoinRequest )
                .expect(201);
      
           /* // Checks that these exist in the returned data.
            expect(response.body).to.have.property('message', 'Member added successfully');
            expect(response.body).to.have.property('member');
      */
            const member = response.body.member;
      /*
            expect(member).to.have.property('groupId', groupId);
            expect(member).to.have.property('userId', userId);
            expect(member).to.have.property('acceptedPool', false);
      */
        } catch (error) {
            console.error(error);
            throw error;
        }
    });
    //Accepts the member to the group by changing the status to true
    it('Updates the acceptedPool to true', async function() {
      const groupId = createdGroupId;
      const userId = 49;
      const acceptJoinRequest = {
        groupId: createdGroupId,
        userId: userId
      }
      try {
          const response = await request(app)
              .put(`/members/${groupId}/update-member/` + userId)
              .send({ acceptJoinRequest })
              .expect(200);
  
          // Checks that these exist in the returned data.
          /*expect(response.body).to.have.property('message', 'Member added successfully');
          expect(response.body).to.have.property('member');
  */
          const member = response.body.member;
  
    /*      expect(member).to.have.property('groupId', groupId);
          expect(member).to.have.property('userId', userId);
          expect(member).to.have.property('acceptedPool', false);
  */
      } catch (error) {
          console.error(error);
          throw error;
      }
  });
      
    //Deletes the previously added member by id
    it('Deleting the member', async function () {
      const groupId = createdGroupId;
      const userId = 49;
      const deleteMemberbyId = {
        groupId: createdGroupId,
        userId: 49
      }
      try {
          const response = await request(app)
              .del(`/members/${groupId}/members/${userId}`)
              .send({ deleteMemberbyId })
              .expect(200);
  
          // Checks that these exist in the returned data.
          expect(response.body).to.have.property('message', 'Member deleted successfully');
  
      } catch (error) {
          console.error(error);
          throw error;
      }
    });
    //Deletes all the members of a group by id
    it('Deleting all members of the group', async function () {
      const groupId = createdGroupId;
      try {
          const response = await request(app)
              .del(`/members/${groupId}/delete-all-members`)
              //.send({ deleteMemberbyId })
              .expect(200);
  
          // Checks that these exist in the returned data.
          expect(response.body).to.have.property('message', 'All members deleted successfully');
  
      } catch (error) {
          console.error(error);
          throw error;
      }
    });
    //Deletes a group by id
    it('Deleting the group', async function() {
        try {
            const groupIdToDelete  = createdGroupId;
            const res = await request(app)
              .del('/groups/delete/'+ groupIdToDelete)
              .expect(200);

            expect(res.body).to.have.property('message', 'Group deleted successfully');
            expect(res.body.result[0]).to.have.property('idgroup');
            expect(res.body.result[0]).to.have.property('idowner');
            expect(res.body.result[0]).to.have.property('groupname');
            expect(res.body.result[0]).to.have.property('groupdescription');

        } catch (error) {
            console.error(error);
            throw error; 
        }
    });

});