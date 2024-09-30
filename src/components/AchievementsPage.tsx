import React, { useEffect } from "react";
import useAchievementsStore from "../store/achievementsStore";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  DialogActions,
  Button,
} from "@mui/material";

interface AchievementsPageProps {
  open: boolean;
  onClose: () => void;
}

const AchievementsPage: React.FC<AchievementsPageProps> = ({
  open,
  onClose,
}) => {
  const { achievements, fetchAchievements } = useAchievementsStore((state) => ({
    achievements: state.achievements,
    fetchAchievements: state.fetchAchievements, // 獲取 fetchAchievements 函數
  }));

  // 當組件掛載或 open 為 true 時，抓取成就數據
  useEffect(() => {
    if (open) {
      fetchAchievements(); // 呼叫 fetchAchievements
    }
  }, [open, fetchAchievements]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>成就列表</DialogTitle>
      <List>
        {achievements.map((achievement) => (
          <ListItem key={achievement.id}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={achievement.completed}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={achievement.id} />
          </ListItem>
        ))}
      </List>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          關閉
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AchievementsPage;
