class FriendsList {
    friends = [];

    addFriend(name) {
        this.friends.push(name);
    }
}

describe('FriendsList', () => {
    it('init friends list', () => {
        const friendsList = new FriendsList();
        expect(friendsList.friends.length).toEqual(0);
    });

    it('adds a friend to the list', () => {
        const friendsList = new FriendsList();
        friendsList.addFriend('Ariel');
        expect(friendsList.friends.length).toEqual(1);
    });
});


describe('my test', () => {
    it('returns true', () => {
        expect(true).toEqual(true);
    });
});