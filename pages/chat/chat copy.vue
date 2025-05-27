<script setup>
import { ref, nextTick, onUnmounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getConversionRecord } from "../../api/api";
import { useWebSocket } from '../../utils/useWebSocket.js';

const contact = ref(null);
const messages = ref([]);
const inputMessage = ref('');
const showMoreTools = ref(false);
const voiceInputMode = ref(false);
const scrollTop = ref(0);
const token = uni.getStorageSync('token');
const ws = useWebSocket(token);

let wsMessageListener = (event) => {
  try {
    const data = JSON.parse(event.data);
    // 判断是否是当前会话的消息
    if (data.conversation?.id === contact.value.id || data.conversationId === contact.value.id) {
      messages.value = [
        ...messages.value,
        {
          id: data.id,
          sender: data.sender,
          content: typeof data.content === 'object' ? data.content : { text: data.content },
          createTime: data.createTime,
          type: data.type,
          receiverId: data.receiverId,
          conversation: data.conversation,
        }
      ];
      nextTick(scrollToBottom);
    }
  } catch (e) {
    console.error('消息解析失败', e);
  }
};

onLoad(async (options) => {
  contact.value = JSON.parse(decodeURIComponent(options.conversation));
  await loadMessages();
  ws.onMessage(wsMessageListener);
});

const loadMessages = async () => {
  const res = await getConversionRecord(contact.value.id, 1, 100);
  messages.value = [...res.list];
  nextTick(scrollToBottom);
};

const sendMessage = () => {
  if (!inputMessage.value.trim()) return;
  const msgObj = {
    conversationId: contact.value.id,
    content: { text: inputMessage.value },
    type: 'TEXT'
  };
  // 本地先插入一条消息
  messages.value = [
    ...messages.value,
    {
      id: Date.now(),
      sender: 'me',
      content: { text: inputMessage.value },
      createTime: new Date(),
      type: 'TEXT',
      status: 'sending'
    }
  ];
  ws.sendMessage(msgObj);
  inputMessage.value = '';
  nextTick(scrollToBottom);
};

const scrollToBottom = () => {
  scrollTop.value = 999999;
};

const toggleMoreTools = () => {
  showMoreTools.value = !showMoreTools.value;
};

const onInputFocus = () => {
  showMoreTools.value = false;
};
const onInputBlur = () => {
  setTimeout(() => {
    showMoreTools.value = false;
  }, 200);
};

const goBack = () => {
  uni.navigateBack();
};

// 语音输入等方法略
</script>