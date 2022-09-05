const spanID = document.getElementById('idSpanElement');
const myVideo = document.getElementById('myVideo');
const friendIdForm = document.getElementById('friendForm')
const InputDataElement = document.getElementById('InputDataElement');
const friendVideo = document.getElementById('friendVideo');
var socket = io();
const peer = new Peer();
peer.on('open', id =>{    socket.emit('peer', id)
})
;(async () => {
  window.navigator.mediaDevices.getUserMedia({video: true, audio: true, peerIdentity: true}).then((data)=>{
    myVideo.srcObject = data;
  }).catch(err => {
    console.log(err)
  })
   
})()     
socket.on('ulanish', (id)=>{
    spanID.textContent = id
})

friendIdForm.addEventListener('submit', (event)=>{
  event.preventDefault();
  console.log(InputDataElement.value)
  socket.emit('call', InputDataElement.value.trim())
})

socket.on('error', e => {
  alert(e)
})


socket.on('call',async (e) => {
  var conn = peer.connect(e)
  conn.on('open', async() => {
    let data = await  window.navigator.mediaDevices.getUserMedia({video: true, audio: true, peerIdentity: true}).then((data)=>{
    let call =  peer.call(e, data);
    call.on('stream', remoteStream => {
      friendVideo.srcObject = remoteStream;
    })
  })
})

peer.on('call', async(conn)=>{
  let data = await  window.navigator.mediaDevices.getUserMedia({video: true, audio: true, peerIdentity: true})
  call.answer(data)
  call.on('stream', remoteStream => {
    friendVideo.srcObject = remoteStream
  })
})
});