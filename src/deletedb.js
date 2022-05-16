function deleteAllData(db) {
    const deleteData = db.all()
    for(const data of deleteData) {
        db.delete(data.ID)
    }
}
async function deleteXP(userId, guildId, db) {
    await db.delete(`${userId}-${guildId}-user`)
}
module.exports = {
    deleteAllData: deleteAllData,
    deleteUserData: deleteXP
}