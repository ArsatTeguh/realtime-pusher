export const handler = async ({ data, roomId }) => {
    pusher.trigger(roomId, 'behavior', data)
}