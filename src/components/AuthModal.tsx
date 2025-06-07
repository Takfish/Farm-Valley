import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.length < 3 || username.length > 10) {
      toast({
        title: "Invalid username",
        description: "Username must be 3-10 characters long",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 3 || password.length > 10) {
      toast({
        title: "Invalid password", 
        description: "Password must be 3-10 characters long",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    const { error } = isLogin 
      ? await signIn(username, password)
      : await signUp(username, password);

    if (error) {
      toast({
        title: isLogin ? "Login failed" : "Signup failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: isLogin ? "Welcome back!" : "Account created successfully!",
        description: isLogin ? "You have been logged in." : "You can now start playing."
      });
      onClose();
      setUsername('');
      setPassword('');
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isLogin ? 'Login' : 'Sign Up'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="3-10 characters"
              minLength={3}
              maxLength={10}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="3-10 characters"
              minLength={3}
              maxLength={10}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
          </Button>
        </form>
        
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => {
              setIsLogin(!isLogin);
              resetForm();
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};