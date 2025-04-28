import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send } from "lucide-react";
import { getUserInitials, formatPrice } from "@/lib/utils";

interface MessageBoxProps {
  itemId: number;
  onClose: () => void;
}

const MessageBox = ({ itemId, onClose }: MessageBoxProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // For a real app, we'd get the current user ID from auth context/state
  const currentUserId = 1; // Just for demo purposes
  
  // Fetch item details
  const { data: item, isLoading: itemLoading } = useQuery({
    queryKey: [`/api/items/${itemId}`],
  });
  
  // Create message mutation
  const createMessage = useMutation({
    mutationFn: async (newMessage: { senderId: number, receiverId: number, itemId: number, content: string }) => {
      const response = await apiRequest("POST", "/api/messages", newMessage);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate messages query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      setMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent to the seller.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    createMessage.mutate({
      senderId: currentUserId,
      receiverId: item.userId,
      itemId: item.id,
      content: message,
    });
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Message to Seller</DialogTitle>
        </DialogHeader>
        
        {itemLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : item ? (
          <>
            <div className="flex items-start gap-4 mb-4">
              <div>
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-16 h-16 object-cover rounded-md" 
                />
              </div>
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                <p className="text-xs text-muted-foreground">{item.condition}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <DialogFooter className="sm:justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>{getUserInitials(`User ${currentUserId}`)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">You</span>
              </div>
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  type="button" 
                  onClick={handleSendMessage}
                  disabled={message.trim() === "" || createMessage.isPending}
                  className="bg-primary hover:bg-primary-dark"
                >
                  {createMessage.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Message
                </Button>
              </div>
            </DialogFooter>
          </>
        ) : (
          <div className="text-center py-4">
            <p>Unable to load item details</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MessageBox;
