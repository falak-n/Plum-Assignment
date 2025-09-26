import { z } from 'zod'

export const OptionSchema = z.object({
	id: z.string().min(1),
	text: z.string().min(1),
	isCorrect: z.boolean()
})

export const QuestionSchema = z.object({
	id: z.string().min(1),
	question: z.string().min(3),
	options: z.array(OptionSchema).length(4),
	explanation: z.string().min(3)
})

export const QuizSchema = z.object({
	topic: z.string().min(2),
	questions: z.array(QuestionSchema).length(5)
})

export function validateQuizJson(raw) {
	try {
		const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
		return QuizSchema.safeParse(parsed)
	} catch (e) {
		return { success: false, error: e }
	}
}