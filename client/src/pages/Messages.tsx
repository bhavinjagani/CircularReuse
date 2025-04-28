import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Send,
  Inbox,
  Archive,
  Loader2,
  RefreshCw,
  AlignLeft,
  AlertCircle
} from "lucide-react";
import { getUserInitials, formatPrice } from "@/lib/utils";
import { Message } from "@shared/schema";

// Demo user ID for this showcase
const CURRENT_USER_ID = 1;

interface ConversationProps {
  senderId: number;
  receiverId: number;
  itemId: number;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isPending: boolean;
}

const Conversation = ({ 
  senderId, 
  receiverId, 
  itemId, 
  messages, 
  onSendMessage, 
  isPending 
}: ConversationProps) => {
  const [newMessage, setNewMessage] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };
  
  const { data: item } = useQuery({
    queryKey: [`/api/items/${itemId}`],
  });
  
  return (
    <div className="flex flex-col h-full">
      {/* Item info header */}
      {item && (
        <div className="mb-4 flex items-center p-3 bg-neutral-gray/20 rounded-lg">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-12 h-12 object-cover rounded-md mr-3" 
          />
          <div className="flex-1">
            <Link href={`/item/${item.id}`}>
              <h3 className="font-medium hover:text-primary cursor-pointer">{item.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
          </div>
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[400px] p-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="font-medium text-base">No messages yet</h3>
            <p className="text-sm text-muted-foreground">
              Start the conversation by sending a message below
            </p>
          </div>
        ) : (
          messages.map(message => {
            const isCurrentUser = message.senderId === CURRENT_USER_ID;
            
            return (
              <div 
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start max-w-[80%]">
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarFallback>
                        {getUserInitials(`User ${message.senderId}`)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div 
                    className={`p-3 rounded-lg ${
                      isCurrentUser 
                        ? 'bg-primary text-white' 
                        : 'bg-neutral-gray/30 text-neutral-dark'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  
                  {isCurrentUser && (
                    <Avatar className="h-8 w-8 ml-2 mt-1">
                      <AvatarFallback>
                        {getUserInitials(`User ${message.senderId}`)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSubmit} className="mt-auto">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 min-h-[80px] resize-none"
          />
          <Button 
            type="submit" 
            className="self-end bg-primary hover:bg-primary-dark"
            disabled={isPending || !newMessage.trim()}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

interface ConversationItem {
  userId: number;
  itemId: number;
  itemTitle: string;
  itemImage: string;
  lastMessage: string;
  unread: boolean;
  timestamp: Date;
}

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<{
    userId: number;
    itemId: number;
  } | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all messages
  const { data: allMessages, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/messages/user/${CURRENT_USER_ID}`],
  });
  
  // Fetch conversation if a conversation is selected
  const { data: conversationMessages } = useQuery({
    queryKey: [
      '/api/messages/conversation', 
      selectedConversation?.userId, 
      selectedConversation?.itemId
    ],
    queryFn: async () => {
      if (!selectedConversation) return [];
      
      const response = await fetch(
        `/api/messages/conversation?user1=${CURRENT_USER_ID}&user2=${selectedConversation.userId}&item=${selectedConversation.itemId}`,
        { credentials: 'include' }
      );
      
      if (!response.ok) throw new Error('Failed to load conversation');
      return response.json();
    },
    enabled: !!selectedConversation,
  });
  
  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (messageData: {
      senderId: number;
      receiverId: number;
      itemId: number;
      content: string;
    }) => {
      const response = await apiRequest("POST", "/api/messages", messageData);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refresh the messages
      queryClient.invalidateQueries({ 
        queryKey: [`/api/messages/user/${CURRENT_USER_ID}`] 
      });
      
      if (selectedConversation) {
        queryClient.invalidateQueries({
          queryKey: [
            '/api/messages/conversation', 
            selectedConversation.userId, 
            selectedConversation.itemId
          ]
        });
      }
      
      toast({
        title: "Message sent successfully",
      });
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;
    
    sendMessage.mutate({
      senderId: CURRENT_USER_ID,
      receiverId: selectedConversation.userId,
      itemId: selectedConversation.itemId,
      content,
    });
  };
  
  // Process messages into grouped conversations
  const processConversations = (): ConversationItem[] => {
    if (!allMessages) return [];
    
    const conversations = new Map<string, ConversationItem>();
    
    allMessages.forEach((message: Message) => {
      // Determine the other user ID
      const otherUserId = message.senderId === CURRENT_USER_ID 
        ? message.receiverId 
        : message.senderId;
      
      const key = `${otherUserId}-${message.itemId}`;
      
      // Use existing conversation or create new one
      const existing = conversations.get(key);
      
      if (!existing || new Date(message.created) > existing.timestamp) {
        // Fetch item details (in a real app, this would be optimized)
        const item = {
          id: message.itemId,
          title: `Item #${message.itemId}`,
          imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&auto=format&fit=crop"
        };
        
        conversations.set(key, {
          userId: otherUserId,
          itemId: message.itemId,
          itemTitle: item.title,
          itemImage: item.imageUrl,
          lastMessage: message.content,
          unread: !message.read && message.receiverId === CURRENT_USER_ID,
          timestamp: new Date(message.created)
        });
      }
    });
    
    // Convert map to array and sort by timestamp (newest first)
    return Array.from(conversations.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };
  
  const conversations = processConversations();
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Messages
            </CardTitle>
            <CardDescription>View and manage your conversations</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" />
              Error Loading Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was a problem loading your messages. Please try again later.</p>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Messages
          </CardTitle>
          <CardDescription>View and manage your conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inbox" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="inbox" className="flex items-center">
                <Inbox className="h-4 w-4 mr-2" />
                Inbox
              </TabsTrigger>
              <TabsTrigger value="archived" className="flex items-center">
                <Archive className="h-4 w-4 mr-2" />
                Archived
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="inbox">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                {/* Conversation List */}
                <div className="md:border-r pr-0 md:pr-4">
                  <div className="mb-4">
                    <Input 
                      placeholder="Search messages..." 
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {conversations.length === 0 ? (
                      <div className="text-center py-8">
                        <AlignLeft className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="font-medium">No messages yet</h3>
                        <p className="text-sm text-muted-foreground">
                          When you message sellers, your conversations will appear here
                        </p>
                      </div>
                    ) : (
                      conversations.map(convo => (
                        <div 
                          key={`${convo.userId}-${convo.itemId}`}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedConversation?.userId === convo.userId && 
                            selectedConversation?.itemId === convo.itemId
                              ? 'bg-primary/10'
                              : 'hover:bg-neutral-gray/20'
                          } ${convo.unread ? 'border-l-4 border-primary' : ''}`}
                          onClick={() => setSelectedConversation({
                            userId: convo.userId,
                            itemId: convo.itemId
                          })}
                        >
                          <div className="flex items-center mb-1">
                            <div className="mr-2 relative">
                              <img 
                                src={convo.itemImage} 
                                alt={convo.itemTitle} 
                                className="w-10 h-10 object-cover rounded" 
                              />
                              <Avatar className="h-5 w-5 absolute -bottom-1 -right-1 ring-2 ring-background">
                                <AvatarFallback className="text-[10px]">
                                  {getUserInitials(`User ${convo.userId}`)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {convo.itemTitle}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {`User ${convo.userId}`}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs truncate">{convo.lastMessage}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-muted-foreground">
                              {convo.timestamp.toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            {convo.unread && (
                              <span className="bg-primary rounded-full w-2 h-2"></span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Conversation View */}
                <div className="md:col-span-2">
                  {selectedConversation ? (
                    <Conversation
                      senderId={CURRENT_USER_ID}
                      receiverId={selectedConversation.userId}
                      itemId={selectedConversation.itemId}
                      messages={conversationMessages || []}
                      onSendMessage={handleSendMessage}
                      isPending={sendMessage.isPending}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg">No conversation selected</h3>
                      <p className="text-muted-foreground mt-2 max-w-sm">
                        Select a conversation from the list to view messages, or start a new conversation by messaging a seller.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="archived">
              <div className="text-center py-12">
                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No archived messages</h3>
                <p className="text-muted-foreground mt-2">
                  Messages you archive will appear here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages;
