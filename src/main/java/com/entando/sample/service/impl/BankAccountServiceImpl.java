package com.entando.sample.service.impl;

import com.entando.sample.service.BankAccountService;
import com.entando.sample.domain.BankAccount;
import com.entando.sample.repository.BankAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link BankAccount}.
 */
@Service
@Transactional
public class BankAccountServiceImpl implements BankAccountService {

    private final Logger log = LoggerFactory.getLogger(BankAccountServiceImpl.class);

    private final BankAccountRepository bankAccountRepository;

    public BankAccountServiceImpl(BankAccountRepository bankAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
    }

    @Override
    public BankAccount save(BankAccount bankAccount) {
        log.debug("Request to save BankAccount : {}", bankAccount);
        return bankAccountRepository.save(bankAccount);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BankAccount> findAll() {
        log.debug("Request to get all BankAccounts");
        return bankAccountRepository.findAll();
    }


    @Override
    @Transactional(readOnly = true)
    public Optional<BankAccount> findOne(Long id) {
        log.debug("Request to get BankAccount : {}", id);
        return bankAccountRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete BankAccount : {}", id);
        bankAccountRepository.deleteById(id);
    }
}
