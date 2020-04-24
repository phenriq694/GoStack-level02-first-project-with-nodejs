import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (type.toLowerCase() !== 'income' && type.toLowerCase() !== 'outcome') {
      throw Error('Transaction Type invalid');
    }

    if (type.toLowerCase() === 'outcome') {
      const { total } = this.transactionsRepository.getBalance();

      if (total < value) {
        throw Error('Outcome is bigger than total');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
