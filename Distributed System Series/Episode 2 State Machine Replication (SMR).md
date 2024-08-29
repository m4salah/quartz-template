---
tags:
  - distributed
  - distributedsystems
  - "#statemachinereplication"
  - "#paxos"
share: "true"
path: Distributed System Series
---
[Youtube video](https://www.youtube.com/watch?v=j8bLPfCJdSw)

We ended up the last episode with definition of the ***Consensus Problem*** So we will try to come up with something to solve the Consensus problem.

Assume we have one machine with single threaded single core or guarantied as single core single threaded (Node) and It has state this state is *Hash Table* To change the state of this node i must make RPC to make an operation for example set(k1, v1), This is network call so it will take some time to complete the operation and return the response. There is different between invocation time (make the call) and the completion time (The k1 is v1 now).

---
## Multiple call on the node from different client:
So I have two option if the two option
- ### Concurrent Execution 
	meaning there is **overlapping window** between the two clients call (join).
	![[concurrent call.png|concurrent call.png]]
	*The green area is the overlapping window*
- ### Sequential Execution
	meaning there is no **overlapping window** between the two call (disjoint)
	![[sequential call.png|sequential call.png]]

---
## Design Key value store.
The design will be as follow.
We have single machine hold in memory hash table, the interface to this store will be (get, set, contains, and remove) and you have to make network call to store what you want.
![[Pasted image 20231012200920.png|Pasted image 20231012200920.png]]

Consistency Guarantee from the node (single core single threaded or it act like single core single threaded) is if c1 make a call to set(k1, v1) and after that immediately c2 make a call get(k1) c2 should get v1 ***WHYYYY ?!***.
Because this is single core single threaded he process one call at a time so even the call from c1 didn't finish setting the k1 c2 call will wait until c1 call processed until then there is already k1 -> v1 in the hash table.
![[Pasted image 20231012201619.png|Pasted image 20231012201619.png]]
Even though the two call appears concurrently (overlapping) but the actual behavior is ***Sequential Execution***. This property called ***Strong Consistency*** 
### Strong Consistency
Is property of system that behaving from the outside as like Single core single threaded, The Execution is happened as sequential order.
![[Pasted image 20231012202229.png|Pasted image 20231012202229.png]]
In this image this node is strong consistent because in the inside is concurrently but from the outside they happened sequentially.

### Scale this model to three node
So now we need to scale this to 3 node under those requirement 
1. Strong Consistency.
2. No Single point of failure (SPOF) or (fault tolerant). The system must be Stateful distributed, the **state is replicas** (No External State).

The model will be
![[Pasted image 20231012205520.png|Pasted image 20231012205520.png]]

So we will try to come up with a solution to make the three node agree on one state (consensus).
The first thing will come into our mid is if any of the node get a write it will tell the rest node what to change to to reach the same state, but what if c1 send set(k1, v1) to n1 and c2 send also in the same time set(k1, v1) to n2 we will reach in a weird state depending which call the other late or early there will be no consensus among the three node.
![[Pasted image 20231012205847.png|Pasted image 20231012205847.png]]

So will need what we call ***Total Order*** (Order of operation):
### Total Order (Order of operation):
We must agree on a way or some algorithm which operation is the first and which is the second. Which operation I must execute first and so on.

---
Suppose we have state for example counter and there is a set of command for example increment and decrement like this.
![[Pasted image 20231012211303.png|Pasted image 20231012211303.png]]
The Register or the counter or even the hash map called **State Machine** because the command can change the state into another state, So What we are trying to solve is replicating the state among all node this is called ***State Machine Replication (SMR)***. Replicating the state (counter or register of hash map).

### Replicating the commands:
Assume we have n1 and n2 with the same initial state, running the same code (same algorithm) if they are executing the same command with the same order they defiantly will land in the same state so i don't need to replicate the state i only need to replicate the command (same initial state, and same algorithm of course).
![[Pasted image 20231012212341.png|Pasted image 20231012212341.png]]
We can replicate the Node under Three condition:
1. Same Initial State
2. Same code (same algorithm)
3. Total Order of events(or commands)
### Add new node to the cluster
With that knowledge it's becoming easier to add node to the cluster I have two option:
- #### Add Node with vanilla state:
	Add node with vanilla state and execute all the command from the very start with same order until we finish
	![[Pasted image 20231012213012.png|Pasted image 20231012213012.png]]
 
- #### Take snapshot from existing node (take fresh state)
	Take snapshot from existing node and remember last command executed on this node then execute the following command after last command remembered 
	![[Pasted image 20231012213132.png|Pasted image 20231012213132.png]]

### Use timestamp to achieve the total order
Assume we attach the timestamp to each command from the client, the problem is those client has different time.
So attach the timestamp from the server, if all the server have the same physical time even to the nano second what happened if there are two command have the same timestamp i will need deterministic algorithm to order them, and there is a lot of problem when dealing with the physical time.
### Use Sequence number to achieve the total order
But the idea remain the same I need some way to order the command by (sequence number for example) but there are universal agreement among all the node in the cluster on that sequence, but who is responsible to put that sequence number ***Leader*** or If node get a sequence number all node must agree on this.

---
## Log Data structure
We need data structure to store that kind of sequence command, basically hold the command with it's order it's like queue but not really a queue this data structure called ***Log***

[[Logs|Logs]]: “A log is perhaps the simplest possible storage abstraction. It is an append-only, totally-ordered sequence of records ordered by time”. [Jay Kreps](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying).
![[log.png|log.png]]

---
## Paxos Algorithm
***What important here is to understand the read and write quorum (majority for read and majority of write)***
The simplest idea about paxos is every write we need a leader for that write, It can be lead election for the sequence number.
### Write Command(set, remove) Write quorum 
Assume we have 3 clients (c1, c2, c3) and 3 node (n1, n2, n3), in paxos any client can send command to any node, so we will assume that c1 send command set(k1, v1) to n1 what will happen after that is n1 will send ***prepare*** (I'm n1 can i have sequence number 1 to execute command set(k1, v1)) to all other node, n1 will wait until it gets what we called ***promise*** (the node which sends promise will not accept any sequence less than or equal to 1) n1 needs the majority of the ***promises***, so in our case i need at least one node to send ***promise*** (*It's recommended to have odd numbers of node*) 
![[Pasted image 20231013162912.png|Pasted image 20231013162912.png]]

### Read command(get, contains) Read quorum
When I want to read the client must send the read command to all nodes and get the majority of the read because I command write with the acceptance of the majority so when i read I must get the majority of the reads.
![[Pasted image 20231013163647.png|Pasted image 20231013163647.png]]

### Conflict Resolution
When there is conflict for example n1 try set(k1, v1) and also n2 who will win the sequence number, it depend who will get the promise first n2 for example will receive conflict from n1 and n3 and those node know own it's largest sequence number promised to the other node n5 promised 5 and n3 promised 3 for example so n2 will try again (***called consensus round***) with sequence number 6 and so on until he get a sequence number. There is a lot of back and forth a lot of latency (this time the client is waiting) so there is a lot of optimization happened.
It's like [Two Phase Commit in database](https://martinfowler.com/articles/patterns-of-distributed-systems/two-phase-commit.html)
![[Pasted image 20231013170024.png|Pasted image 20231013170024.png]]
