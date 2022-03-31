var users = [];

function userJoin(id, username, group){
    const user = {id, username, group}

    users.push(user);

    return user;
}

function getCurrentUser(id){
    return users.find(user => user.id === id);
}

function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if (index !== -1)
        return users.splice(index, 1)[0];
}

function getGroupUsers(group){
    return users.filter(user => user.group === group);
}

module.exports = { 
    userJoin, 
    getCurrentUser,
    userLeave,
    getGroupUsers
}
