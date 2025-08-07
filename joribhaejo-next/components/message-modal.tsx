"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquarePlus, Send, X, Inbox, Send as SendIcon, Trash2 } from "lucide-react"

interface MessageItem {
  id: number;
  senderId: number;
  senderUsername: string;
  receiverId: number;
  receiverUsername: string;
  content: string;
  createdAt: string;
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSendMessage: (recipient: string, message: string) => void;
  receivedMessages: MessageItem[];
  sentMessages: MessageItem[];
  onDeleteMessage: (messageId: number) => void;
}

export function MessageModal({ isOpen, onClose, title, onSendMessage, receivedMessages, sentMessages, onDeleteMessage }: MessageModalProps) {
  const [isWritingMode, setIsWritingMode] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [newRecipient, setNewRecipient] = useState("");
  const [currentView, setCurrentView] = useState<'received' | 'sent'>('received');

  const handleSendMessage = () => {
    onSendMessage(newRecipient, newMessageContent);
    setNewMessageContent("");
    setNewRecipient("");
    setIsWritingMode(false);
    onClose();
  };

  const handleCancelWrite = () => {
    setNewMessageContent("");
    setNewRecipient("");
    setIsWritingMode(false);
  };

  const messagesToDisplay = currentView === 'received' ? receivedMessages : sentMessages;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
            {isWritingMode ? "새 메시지 작성" : "메시지"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isWritingMode ? "새로운 메시지를 작성하여 전송하세요." : "주고받은 메시지를 확인하고 새로운 메시지를 작성하세요."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isWritingMode ? (
            <div className="flex flex-col space-y-4">
              <Input
                placeholder="받는 사람 (사용자 이름)"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                className="border border-gray-700 bg-gray-900 text-gray-100"
              />
              <Textarea
                placeholder="메시지를 입력하세요..."
                value={newMessageContent}
                onChange={(e) => setNewMessageContent(e.target.value)}
                className="min-h-[120px] border border-gray-700 bg-gray-900 text-gray-100"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancelWrite} className="text-gray-300 border-gray-700 hover:bg-gray-700">
                  <X className="w-4 h-4 mr-2" />
                  취소
                </Button>
                <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  전송
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center space-x-2 mb-4">
                <Button
                  variant={currentView === 'received' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('received')}
                  className={currentView === 'received' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-gray-300 border-gray-700 hover:bg-gray-700'}
                >
                  <Inbox className="w-4 h-4 mr-2" />
                  받은 쪽지함
                </Button>
                <Button
                  variant={currentView === 'sent' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('sent')}
                  className={currentView === 'sent' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-gray-300 border-gray-700 hover:bg-gray-700'}
                >
                  <SendIcon className="w-4 h-4 mr-2" />
                  보낸 쪽지함
                </Button>
              </div>
              <div className="h-48 overflow-y-auto border border-gray-700 rounded-md p-4 text-gray-300">
                {messagesToDisplay.length > 0 ? (
                  messagesToDisplay.map((msg) => (
                    <div key={msg.id} className="mb-2 p-2 border-b border-gray-700 last:border-b-0 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold">{currentView === 'received' ? `보낸 사람: ${msg.senderUsername}` : `받는 사람: ${msg.receiverUsername}`}</p>
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs text-gray-500 text-right">{msg.createdAt}</p>
                      </div>
                      {currentView === 'sent' && (
                        <Button variant="ghost" size="icon" onClick={() => onDeleteMessage(msg.id)} className="text-red-400 hover:bg-gray-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p>{currentView === 'received' ? "받은 메시지가 없습니다." : "보낸 메시지가 없습니다."}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setIsWritingMode(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <MessageSquarePlus className="w-4 h-4 mr-2" />
                  메시지 쓰기
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
