from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import schemas, models, auth, database
from ..services.model import ModelService

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

@router.post("/create", response_model=schemas.Chat)
def create_chat(chat: schemas.ChatCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_chat = models.Chat(title=chat.title, user_id=current_user.id)
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat

@router.get("/all", response_model=List[schemas.Chat])
def get_user_chats(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    chats = db.query(models.Chat).filter(models.Chat.user_id == current_user.id).all()
    return chats

@router.get("/{chat_id}", response_model=schemas.Chat)
def get_chat(chat_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat

@router.post("/generate", response_model=schemas.Message)
async def generate_response(req: schemas.GenerateRequest, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Verify chat belongs to user
    chat = db.query(models.Chat).filter(models.Chat.id == req.chat_id, models.Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # Save user message
    user_msg = models.Message(chat_id=req.chat_id, role="user", content=req.message)
    db.add(user_msg)
    db.commit()

    # Get history
    messages = db.query(models.Message).filter(models.Message.chat_id == req.chat_id).order_by(models.Message.timestamp).all()
    history = [{"role": msg.role, "content": msg.content} for msg in messages]

    # Generate response from model
    assistant_text = await ModelService.generate_response(history)

    # Save assistant message
    assistant_msg = models.Message(chat_id=req.chat_id, role="assistant", content=assistant_text)
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return assistant_msg

@router.delete("/{chat_id}")
def delete_chat(chat_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    db.query(models.Message).filter(models.Message.chat_id == chat_id).delete()
    db.delete(chat)
    db.commit()
    return {"message": "Chat deleted successfully"}
