const OnlineUsers = []
const session_expiries = []
const ExpiryT = 7200

const SocketService = {
    set_online(info, socket) {
		const isAlreadyOnline = OnlineUsers.some((user) => Number(user.id) === Number(info.id));

		if (!isAlreadyOnline) {
			OnlineUsers.push(info);
			console.log("user:", info.uname, "connected.. Identity:", socket.identification);
		}

		const payload = {
			usersocket_id: info.usersocket_id,
			iat: '',
			userId: info.id,
			uname: info.uname,
			exp: '',
			iss: "core-socket",
		};

		this.session_expiry(payload);
	},

    session_expiry(info) {
        if (session_expiries.length) {
            const findTar = session_expiries.find((e) => (e.userId === info.userId))
            if (findTar) {
                session_expiries.map((item, idx) => {
                    if (item.userId === info.userId) {
                        const timestamp = Math.floor(Date.now() / 1000)
                        session_expiries[idx]['iat'] = timestamp
                        session_expiries[idx]['exp'] = timestamp + ExpiryT
                    }
                    return true
                })
            } else {
                const timestamp = Math.floor(Date.now() / 1000)
                info.iat = timestamp
                info.exp = timestamp + ExpiryT
                session_expiries.push(info)
            }
        } else {
            const timestamp = Math.floor(Date.now() / 1000)
            info.iat = timestamp
            info.exp = timestamp + ExpiryT
            session_expiries.push(info)
        }
    }
}

class Connection
{
    constructor (io, socket) {
        this.socket = socket;
        this.io = io;

        const { userId, uname, usersocket_id } = socket.handshake.auth;
        
        if (userId) {
            const info = {
                id: userId,
                uname: uname || `User-${userId}`,
                usersocket_id: usersocket_id || socket.id,
            };

            socket.identification = userId
    
            SocketService.set_online(info, socket);

            socket.on("disconnect", (reason) => {
                OnlineUsers.map((item, idx) => {
                    if (item.usersocket_id === socket.id) {
                        OnlineUsers.splice(idx, 1)
                        this.isdisconnected(socket.id)
                        session_expiries.map((items, idxx) => {
                            if (items.userId === item.id) {
                                session_expiries.splice(idxx, 1)
                                console.log('user:', items.uname, 'session log deleted! [Disconnected]')
                            }
                            return true
                        })
                    }
                    return true
                })
            });
        } else {
            socket.disconnect(true);
        }

        socket.on("connect_err", () => {
            setTimeout(() => {
                socket.connect();
            }, 1000)
        });
        
        // socket auth 
        socket.on('set online', (info) => {
            console.log(info)
            socket.identification = info.employeeNumber
            this.set_online(info, socket)
        });

        // page as id
        socket.on("load page", (data) => {
            socket.join(data);
        });

        // emit load data
        socket.on("load", (data) => {
            socket.to(data.page).emit("load data", data);
        });
    }
    // disconnect emitter
    isdisconnected(id) {
        this.io.sockets.emit('isdisconnect', id)
    }
}

const server = (io) => {

    io.on('connection', (socket) => {
        socket.use(([event, ...args], next) => {
            next();
        })

        new Connection(io, socket)
    })
}

module.exports = server;