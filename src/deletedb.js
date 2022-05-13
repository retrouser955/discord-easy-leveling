function deleteAllData(db) {
    const deleteData = db.all()
    for(const data of deleteData) {
        db.delete(data.ID)
    }
}
async function deleteXP(userId, guildId) {
    await db.delete(`${userId}-${guildId}-XP`)
    await db.delete(`${userId}-${guildId}-level`)
}
module.exports = {
    deleteAllData: deleteAllData,
    deleteUserData: deleteXP
}