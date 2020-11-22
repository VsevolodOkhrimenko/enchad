from channels.generic.websocket import AsyncJsonWebsocketConsumer


class MessagingConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        group_name = 'messages_{}'.format(self.scope['user'].id)

        await self.channel_layer.group_add(
            group_name,
            self.channel_name
        )

        await self.accept('Token')

    async def disconnect(self, close_code):
        group_name = 'messages_{}'.format(self.scope['user'].id)

        await self.channel_layer.group_discard(
            group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def chat_message(self, message_data):
        await self.send_json(content=message_data)

    async def chat_read(self, message_data):
        await self.send_json(content=message_data)

    async def thread_create(self, message_data):
        await self.send_json(content=message_data)

    async def thread_update(self, message_data):
        await self.send_json(content=message_data)
