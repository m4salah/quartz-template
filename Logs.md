“A log is perhaps the simplest possible storage abstraction. It is an append-only, totally-ordered sequence of records ordered by time”. [Jay Kreps](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying).

# At-most-once processing
The atomic read-delete operations of a durable queue are obviously dangerous when a network is placed in the middle. If a consumer performs a destructive read but fails before being able to process the message then that message is lost — this is at-most-once processing

# At-least-once processing
If we want at-least-once processing guarantees then we need to separate the read and delete into separate operations. This also means that the queue now needs to maintain a little state machine for each message. We usually use the word “acknowledge” instead of delete, but some queues (SQS) use the delete term.
![[QueueItemStatesSmall.png|QueueItemStatesSmall.png]]
What happens to a message that timed out while out for delivery? It gets delivered again. How can we guarantee that we only deliver the message again if the message was definitely not processed? We can’t. The consumer might have processed the message but failed before it could send the acknowledge/delete command. Second question: if we are redelivering messages, can that affect ordering guarantees? Yes it can.
![[QueueOperationsSmall.png|QueueOperationsSmall.png]]
# Resources
- https://jack-vanlightly.com/blog/2023/10/2/the-advantages-of-queues-on-logs
- https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying
- https://www.youtube.com/live/27Xz7C1A-Co?si=N34iWudVw41xPzaN
- https://youtu.be/TUqDd8PYfzM?si=QpDZv4ov_OtjDdiv
- https://www.youtube.com/watch?v=uHvR7nOu5m4