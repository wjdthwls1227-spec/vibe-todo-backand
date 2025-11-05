const express = require('express');
const Todo = require('../models/todo');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const items = await Todo.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('할일 목록 조회 실패', error);
    res.status(500).json({ error: '할일 목록 조회에 실패했습니다' });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('POST /todos 요청 받음:', req.body);
    const { title } = req.body;

    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: '제목은 필수 항목입니다' });
    }

    const todo = await Todo.create({
      title: title.trim(),
    });

    console.log('할일 생성 성공:', todo);
    res.status(201).json(todo);
  } catch (error) {
    console.error('할일 생성 실패', error);
    res.status(500).json({ error: '할일 생성에 실패했습니다', details: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: '할일을 찾을 수 없습니다' });
    }

    if (typeof req.body.title === 'string') {
      const trimmed = req.body.title.trim();
      if (!trimmed) {
        return res.status(400).json({ error: '제목은 비어있을 수 없습니다' });
      }
      todo.title = trimmed;
    }

    if (typeof req.body.completed === 'boolean') {
      todo.completed = req.body.completed;
    }

    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error('할일 수정 실패', error);
    res.status(500).json({ error: '할일 수정에 실패했습니다' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ error: '할일을 찾을 수 없습니다' });
    }

    res.json(todo);
  } catch (error) {
    console.error('할일 삭제 실패', error);
    res.status(500).json({ error: '할일 삭제에 실패했습니다' });
  }
});

module.exports = router;

