package com.entando.sample.web.rest;

import com.entando.sample.SampleApp;
import com.entando.sample.config.TestSecurityConfiguration;
import com.entando.sample.domain.BankAccount;
import com.entando.sample.domain.Operation;
import com.entando.sample.repository.BankAccountRepository;
import com.entando.sample.service.BankAccountService;
import com.entando.sample.service.dto.BankAccountCriteria;
import com.entando.sample.service.BankAccountQueryService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.entando.sample.domain.enumeration.BankAccountType;
/**
 * Integration tests for the {@link BankAccountResource} REST controller.
 */
@SpringBootTest(classes = { SampleApp.class, TestSecurityConfiguration.class })
@AutoConfigureMockMvc
@WithMockUser
public class BankAccountResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_BANK_NUMBER = 1;
    private static final Integer UPDATED_BANK_NUMBER = 2;
    private static final Integer SMALLER_BANK_NUMBER = 1 - 1;

    private static final Long DEFAULT_AGENCY_NUMBER = 1L;
    private static final Long UPDATED_AGENCY_NUMBER = 2L;
    private static final Long SMALLER_AGENCY_NUMBER = 1L - 1L;

    private static final Float DEFAULT_LAST_OPERATION_DURATION = 1F;
    private static final Float UPDATED_LAST_OPERATION_DURATION = 2F;
    private static final Float SMALLER_LAST_OPERATION_DURATION = 1F - 1F;

    private static final Double DEFAULT_MEAN_OPERATION_DURATION = 1D;
    private static final Double UPDATED_MEAN_OPERATION_DURATION = 2D;
    private static final Double SMALLER_MEAN_OPERATION_DURATION = 1D - 1D;

    private static final BigDecimal DEFAULT_BALANCE = new BigDecimal(1);
    private static final BigDecimal UPDATED_BALANCE = new BigDecimal(2);
    private static final BigDecimal SMALLER_BALANCE = new BigDecimal(1 - 1);

    private static final LocalDate DEFAULT_OPENING_DAY = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_OPENING_DAY = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_OPENING_DAY = LocalDate.ofEpochDay(-1L);

    private static final Instant DEFAULT_LAST_OPERATION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_OPERATION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final BankAccountType DEFAULT_ACCOUNT_TYPE = BankAccountType.CHECKING;
    private static final BankAccountType UPDATED_ACCOUNT_TYPE = BankAccountType.SAVINGS;

    private static final byte[] DEFAULT_ATTACHMENT = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ATTACHMENT = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_ATTACHMENT_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ATTACHMENT_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private BankAccountService bankAccountService;

    @Autowired
    private BankAccountQueryService bankAccountQueryService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBankAccountMockMvc;

    private BankAccount bankAccount;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BankAccount createEntity(EntityManager em) {
        BankAccount bankAccount = new BankAccount()
            .name(DEFAULT_NAME)
            .bankNumber(DEFAULT_BANK_NUMBER)
            .agencyNumber(DEFAULT_AGENCY_NUMBER)
            .lastOperationDuration(DEFAULT_LAST_OPERATION_DURATION)
            .meanOperationDuration(DEFAULT_MEAN_OPERATION_DURATION)
            .balance(DEFAULT_BALANCE)
            .openingDay(DEFAULT_OPENING_DAY)
            .lastOperationDate(DEFAULT_LAST_OPERATION_DATE)
            .active(DEFAULT_ACTIVE)
            .accountType(DEFAULT_ACCOUNT_TYPE)
            .attachment(DEFAULT_ATTACHMENT)
            .attachmentContentType(DEFAULT_ATTACHMENT_CONTENT_TYPE)
            .description(DEFAULT_DESCRIPTION);
        return bankAccount;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BankAccount createUpdatedEntity(EntityManager em) {
        BankAccount bankAccount = new BankAccount()
            .name(UPDATED_NAME)
            .bankNumber(UPDATED_BANK_NUMBER)
            .agencyNumber(UPDATED_AGENCY_NUMBER)
            .lastOperationDuration(UPDATED_LAST_OPERATION_DURATION)
            .meanOperationDuration(UPDATED_MEAN_OPERATION_DURATION)
            .balance(UPDATED_BALANCE)
            .openingDay(UPDATED_OPENING_DAY)
            .lastOperationDate(UPDATED_LAST_OPERATION_DATE)
            .active(UPDATED_ACTIVE)
            .accountType(UPDATED_ACCOUNT_TYPE)
            .attachment(UPDATED_ATTACHMENT)
            .attachmentContentType(UPDATED_ATTACHMENT_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION);
        return bankAccount;
    }

    @BeforeEach
    public void initTest() {
        bankAccount = createEntity(em);
    }

    @Test
    @Transactional
    public void createBankAccount() throws Exception {
        int databaseSizeBeforeCreate = bankAccountRepository.findAll().size();
        // Create the BankAccount
        restBankAccountMockMvc.perform(post("/api/bank-accounts").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bankAccount)))
            .andExpect(status().isCreated());

        // Validate the BankAccount in the database
        List<BankAccount> bankAccountList = bankAccountRepository.findAll();
        assertThat(bankAccountList).hasSize(databaseSizeBeforeCreate + 1);
        BankAccount testBankAccount = bankAccountList.get(bankAccountList.size() - 1);
        assertThat(testBankAccount.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBankAccount.getBankNumber()).isEqualTo(DEFAULT_BANK_NUMBER);
        assertThat(testBankAccount.getAgencyNumber()).isEqualTo(DEFAULT_AGENCY_NUMBER);
        assertThat(testBankAccount.getLastOperationDuration()).isEqualTo(DEFAULT_LAST_OPERATION_DURATION);
        assertThat(testBankAccount.getMeanOperationDuration()).isEqualTo(DEFAULT_MEAN_OPERATION_DURATION);
        assertThat(testBankAccount.getBalance()).isEqualTo(DEFAULT_BALANCE);
        assertThat(testBankAccount.getOpeningDay()).isEqualTo(DEFAULT_OPENING_DAY);
        assertThat(testBankAccount.getLastOperationDate()).isEqualTo(DEFAULT_LAST_OPERATION_DATE);
        assertThat(testBankAccount.isActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testBankAccount.getAccountType()).isEqualTo(DEFAULT_ACCOUNT_TYPE);
        assertThat(testBankAccount.getAttachment()).isEqualTo(DEFAULT_ATTACHMENT);
        assertThat(testBankAccount.getAttachmentContentType()).isEqualTo(DEFAULT_ATTACHMENT_CONTENT_TYPE);
        assertThat(testBankAccount.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createBankAccountWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = bankAccountRepository.findAll().size();

        // Create the BankAccount with an existing ID
        bankAccount.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBankAccountMockMvc.perform(post("/api/bank-accounts").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bankAccount)))
            .andExpect(status().isBadRequest());

        // Validate the BankAccount in the database
        List<BankAccount> bankAccountList = bankAccountRepository.findAll();
        assertThat(bankAccountList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = bankAccountRepository.findAll().size();
        // set the field null
        bankAccount.setName(null);

        // Create the BankAccount, which fails.


        restBankAccountMockMvc.perform(post("/api/bank-accounts").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bankAccount)))
            .andExpect(status().isBadRequest());

        List<BankAccount> bankAccountList = bankAccountRepository.findAll();
        assertThat(bankAccountList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkBalanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = bankAccountRepository.findAll().size();
        // set the field null
        bankAccount.setBalance(null);

        // Create the BankAccount, which fails.


        restBankAccountMockMvc.perform(post("/api/bank-accounts").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bankAccount)))
            .andExpect(status().isBadRequest());

        List<BankAccount> bankAccountList = bankAccountRepository.findAll();
        assertThat(bankAccountList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBankAccounts() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList
        restBankAccountMockMvc.perform(get("/api/bank-accounts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bankAccount.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].bankNumber").value(hasItem(DEFAULT_BANK_NUMBER)))
            .andExpect(jsonPath("$.[*].agencyNumber").value(hasItem(DEFAULT_AGENCY_NUMBER.intValue())))
            .andExpect(jsonPath("$.[*].lastOperationDuration").value(hasItem(DEFAULT_LAST_OPERATION_DURATION.doubleValue())))
            .andExpect(jsonPath("$.[*].meanOperationDuration").value(hasItem(DEFAULT_MEAN_OPERATION_DURATION.doubleValue())))
            .andExpect(jsonPath("$.[*].balance").value(hasItem(DEFAULT_BALANCE.intValue())))
            .andExpect(jsonPath("$.[*].openingDay").value(hasItem(DEFAULT_OPENING_DAY.toString())))
            .andExpect(jsonPath("$.[*].lastOperationDate").value(hasItem(DEFAULT_LAST_OPERATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].accountType").value(hasItem(DEFAULT_ACCOUNT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].attachmentContentType").value(hasItem(DEFAULT_ATTACHMENT_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].attachment").value(hasItem(Base64Utils.encodeToString(DEFAULT_ATTACHMENT))))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }
    
    @Test
    @Transactional
    public void getBankAccount() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get the bankAccount
        restBankAccountMockMvc.perform(get("/api/bank-accounts/{id}", bankAccount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bankAccount.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.bankNumber").value(DEFAULT_BANK_NUMBER))
            .andExpect(jsonPath("$.agencyNumber").value(DEFAULT_AGENCY_NUMBER.intValue()))
            .andExpect(jsonPath("$.lastOperationDuration").value(DEFAULT_LAST_OPERATION_DURATION.doubleValue()))
            .andExpect(jsonPath("$.meanOperationDuration").value(DEFAULT_MEAN_OPERATION_DURATION.doubleValue()))
            .andExpect(jsonPath("$.balance").value(DEFAULT_BALANCE.intValue()))
            .andExpect(jsonPath("$.openingDay").value(DEFAULT_OPENING_DAY.toString()))
            .andExpect(jsonPath("$.lastOperationDate").value(DEFAULT_LAST_OPERATION_DATE.toString()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()))
            .andExpect(jsonPath("$.accountType").value(DEFAULT_ACCOUNT_TYPE.toString()))
            .andExpect(jsonPath("$.attachmentContentType").value(DEFAULT_ATTACHMENT_CONTENT_TYPE))
            .andExpect(jsonPath("$.attachment").value(Base64Utils.encodeToString(DEFAULT_ATTACHMENT)))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }


    @Test
    @Transactional
    public void getBankAccountsByIdFiltering() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        Long id = bankAccount.getId();

        defaultBankAccountShouldBeFound("id.equals=" + id);
        defaultBankAccountShouldNotBeFound("id.notEquals=" + id);

        defaultBankAccountShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultBankAccountShouldNotBeFound("id.greaterThan=" + id);

        defaultBankAccountShouldBeFound("id.lessThanOrEqual=" + id);
        defaultBankAccountShouldNotBeFound("id.lessThan=" + id);
    }


    @Test
    @Transactional
    public void getAllBankAccountsByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where name equals to DEFAULT_NAME
        defaultBankAccountShouldBeFound("name.equals=" + DEFAULT_NAME);

        // Get all the bankAccountList where name equals to UPDATED_NAME
        defaultBankAccountShouldNotBeFound("name.equals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByNameIsNotEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where name not equals to DEFAULT_NAME
        defaultBankAccountShouldNotBeFound("name.notEquals=" + DEFAULT_NAME);

        // Get all the bankAccountList where name not equals to UPDATED_NAME
        defaultBankAccountShouldBeFound("name.notEquals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByNameIsInShouldWork() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where name in DEFAULT_NAME or UPDATED_NAME
        defaultBankAccountShouldBeFound("name.in=" + DEFAULT_NAME + "," + UPDATED_NAME);

        // Get all the bankAccountList where name equals to UPDATED_NAME
        defaultBankAccountShouldNotBeFound("name.in=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where name is not null
        defaultBankAccountShouldBeFound("name.specified=true");

        // Get all the bankAccountList where name is null
        defaultBankAccountShouldNotBeFound("name.specified=false");
    }
                @Test
    @Transactional
    public void getAllBankAccountsByNameContainsSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where name contains DEFAULT_NAME
        defaultBankAccountShouldBeFound("name.contains=" + DEFAULT_NAME);

        // Get all the bankAccountList where name contains UPDATED_NAME
        defaultBankAccountShouldNotBeFound("name.contains=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByNameNotContainsSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where name does not contain DEFAULT_NAME
        defaultBankAccountShouldNotBeFound("name.doesNotContain=" + DEFAULT_NAME);

        // Get all the bankAccountList where name does not contain UPDATED_NAME
        defaultBankAccountShouldBeFound("name.doesNotContain=" + UPDATED_NAME);
    }


    @Test
    @Transactional
    public void getAllBankAccountsByBankNumberIsEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where bankNumber equals to DEFAULT_BANK_NUMBER
        defaultBankAccountShouldBeFound("bankNumber.equals=" + DEFAULT_BANK_NUMBER);

        // Get all the bankAccountList where bankNumber equals to UPDATED_BANK_NUMBER
        defaultBankAccountShouldNotBeFound("bankNumber.equals=" + UPDATED_BANK_NUMBER);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByBankNumberIsNotEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where bankNumber not equals to DEFAULT_BANK_NUMBER
        defaultBankAccountShouldNotBeFound("bankNumber.notEquals=" + DEFAULT_BANK_NUMBER);

        // Get all the bankAccountList where bankNumber not equals to UPDATED_BANK_NUMBER
        defaultBankAccountShouldBeFound("bankNumber.notEquals=" + UPDATED_BANK_NUMBER);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByBankNumberIsInShouldWork() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where bankNumber in DEFAULT_BANK_NUMBER or UPDATED_BANK_NUMBER
        defaultBankAccountShouldBeFound("bankNumber.in=" + DEFAULT_BANK_NUMBER + "," + UPDATED_BANK_NUMBER);

        // Get all the bankAccountList where bankNumber equals to UPDATED_BANK_NUMBER
        defaultBankAccountShouldNotBeFound("bankNumber.in=" + UPDATED_BANK_NUMBER);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByBankNumberIsNullOrNotNull() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where bankNumber is not null
        defaultBankAccountShouldBeFound("bankNumber.specified=true");

        // Get all the bankAccountList where bankNumber is null
        defaultBankAccountShouldNotBeFound("bankNumber.specified=false");
    }

    @Test
    @Transactional
    public void getAllBankAccountsByBankNumberIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where bankNumber is greater than or equal to DEFAULT_BANK_NUMBER
        defaultBankAccountShouldBeFound("bankNumber.greaterThanOrEqual=" + DEFAULT_BANK_NUMBER);

        // Get all the bankAccountList where bankNumber is greater than or equal to UPDATED_BANK_NUMBER
        defaultBankAccountShouldNotBeFound("bankNumber.greaterThanOrEqual=" + UPDATED_BANK_NUMBER);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByBankNumberIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where bankNumber is less than or equal to DEFAULT_BANK_NUMBER
        defaultBankAccountShouldBeFound("bankNumber.lessThanOrEqual=" + DEFAULT_BANK_NUMBER);

        // Get all the bankAccountList where bankNumber is less than or equal to SMALLER_BANK_NUMBER
        defaultBankAccountShouldNotBeFound("bankNumber.lessThanOrEqual=" + SMALLER_BANK_NUMBER);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByBankNumberIsLessThanSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where bankNumber is less than DEFAULT_BANK_NUMBER
        defaultBankAccountShouldNotBeFound("bankNumber.lessThan=" + DEFAULT_BANK_NUMBER);

        // Get all the bankAccountList where bankNumber is less than UPDATED_BANK_NUMBER
        defaultBankAccountShouldBeFound("bankNumber.lessThan=" + UPDATED_BANK_NUMBER);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByBankNumberIsGreaterThanSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where bankNumber is greater than DEFAULT_BANK_NUMBER
        defaultBankAccountShouldNotBeFound("bankNumber.greaterThan=" + DEFAULT_BANK_NUMBER);

        // Get all the bankAccountList where bankNumber is greater than SMALLER_BANK_NUMBER
        defaultBankAccountShouldBeFound("bankNumber.greaterThan=" + SMALLER_BANK_NUMBER);
    }


    @Test
    @Transactional
    public void getAllBankAccountsByAgencyNumberIsEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where agencyNumber equals to DEFAULT_AGENCY_NUMBER
        defaultBankAccountShouldBeFound("agencyNumber.equals=" + DEFAULT_AGENCY_NUMBER);

        // Get all the bankAccountList where agencyNumber equals to UPDATED_AGENCY_NUMBER
        defaultBankAccountShouldNotBeFound("agencyNumber.equals=" + UPDATED_AGENCY_NUMBER);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByAgencyNumberIsNotEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where agencyNumber not equals to DEFAULT_AGENCY_NUMBER
        defaultBankAccountShouldNotBeFound("agencyNumber.notEquals=" + DEFAULT_AGENCY_NUMBER);

        // Get all the bankAccountList where agencyNumber not equals to UPDATED_AGENCY_NUMBER
        defaultBankAccountShouldBeFound("agencyNumber.notEquals=" + UPDATED_AGENCY_NUMBER);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByAgencyNumberIsInShouldWork() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where agencyNumber in DEFAULT_AGENCY_NUMBER or UPDATED_AGENCY_NUMBER
        defaultBankAccountShouldBeFound("agencyNumber.in=" + DEFAULT_AGENCY_NUMBER + "," + UPDATED_AGENCY_NUMBER);

        // Get all the bankAccountList where agencyNumber equals to UPDATED_AGENCY_NUMBER
        defaultBankAccountShouldNotBeFound("agencyNumber.in=" + UPDATED_AGENCY_NUMBER);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByAgencyNumberIsNullOrNotNull() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where agencyNumber is not null
        defaultBankAccountShouldBeFound("agencyNumber.specified=true");

        // Get all the bankAccountList where agencyNumber is null
        defaultBankAccountShouldNotBeFound("agencyNumber.specified=false");
    }

    @Test
    @Transactional
    public void getAllBankAccountsByAgencyNumberIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where agencyNumber is greater than or equal to DEFAULT_AGENCY_NUMBER
        defaultBankAccountShouldBeFound("agencyNumber.greaterThanOrEqual=" + DEFAULT_AGENCY_NUMBER);

        // Get all the bankAccountList where agencyNumber is greater than or equal to UPDATED_AGENCY_NUMBER
        defaultBankAccountShouldNotBeFound("agencyNumber.greaterThanOrEqual=" + UPDATED_AGENCY_NUMBER);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByAgencyNumberIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where agencyNumber is less than or equal to DEFAULT_AGENCY_NUMBER
        defaultBankAccountShouldBeFound("agencyNumber.lessThanOrEqual=" + DEFAULT_AGENCY_NUMBER);

        // Get all the bankAccountList where agencyNumber is less than or equal to SMALLER_AGENCY_NUMBER
        defaultBankAccountShouldNotBeFound("agencyNumber.lessThanOrEqual=" + SMALLER_AGENCY_NUMBER);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByAgencyNumberIsLessThanSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where agencyNumber is less than DEFAULT_AGENCY_NUMBER
        defaultBankAccountShouldNotBeFound("agencyNumber.lessThan=" + DEFAULT_AGENCY_NUMBER);

        // Get all the bankAccountList where agencyNumber is less than UPDATED_AGENCY_NUMBER
        defaultBankAccountShouldBeFound("agencyNumber.lessThan=" + UPDATED_AGENCY_NUMBER);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByAgencyNumberIsGreaterThanSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where agencyNumber is greater than DEFAULT_AGENCY_NUMBER
        defaultBankAccountShouldNotBeFound("agencyNumber.greaterThan=" + DEFAULT_AGENCY_NUMBER);

        // Get all the bankAccountList where agencyNumber is greater than SMALLER_AGENCY_NUMBER
        defaultBankAccountShouldBeFound("agencyNumber.greaterThan=" + SMALLER_AGENCY_NUMBER);
    }


    @Test
    @Transactional
    public void getAllBankAccountsByLastOperationDurationIsEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where lastOperationDuration equals to DEFAULT_LAST_OPERATION_DURATION
        defaultBankAccountShouldBeFound("lastOperationDuration.equals=" + DEFAULT_LAST_OPERATION_DURATION);

        // Get all the bankAccountList where lastOperationDuration equals to UPDATED_LAST_OPERATION_DURATION
        defaultBankAccountShouldNotBeFound("lastOperationDuration.equals=" + UPDATED_LAST_OPERATION_DURATION);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByLastOperationDurationIsNotEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where lastOperationDuration not equals to DEFAULT_LAST_OPERATION_DURATION
        defaultBankAccountShouldNotBeFound("lastOperationDuration.notEquals=" + DEFAULT_LAST_OPERATION_DURATION);

        // Get all the bankAccountList where lastOperationDuration not equals to UPDATED_LAST_OPERATION_DURATION
        defaultBankAccountShouldBeFound("lastOperationDuration.notEquals=" + UPDATED_LAST_OPERATION_DURATION);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByLastOperationDurationIsInShouldWork() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where lastOperationDuration in DEFAULT_LAST_OPERATION_DURATION or UPDATED_LAST_OPERATION_DURATION
        defaultBankAccountShouldBeFound("lastOperationDuration.in=" + DEFAULT_LAST_OPERATION_DURATION + "," + UPDATED_LAST_OPERATION_DURATION);

        // Get all the bankAccountList where lastOperationDuration equals to UPDATED_LAST_OPERATION_DURATION
        defaultBankAccountShouldNotBeFound("lastOperationDuration.in=" + UPDATED_LAST_OPERATION_DURATION);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByLastOperationDurationIsNullOrNotNull() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where lastOperationDuration is not null
        defaultBankAccountShouldBeFound("lastOperationDuration.specified=true");

        // Get all the bankAccountList where lastOperationDuration is null
        defaultBankAccountShouldNotBeFound("lastOperationDuration.specified=false");
    }

    @Test
    @Transactional
    public void getAllBankAccountsByLastOperationDurationIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where lastOperationDuration is greater than or equal to DEFAULT_LAST_OPERATION_DURATION
        defaultBankAccountShouldBeFound("lastOperationDuration.greaterThanOrEqual=" + DEFAULT_LAST_OPERATION_DURATION);

        // Get all the bankAccountList where lastOperationDuration is greater than or equal to UPDATED_LAST_OPERATION_DURATION
        defaultBankAccountShouldNotBeFound("lastOperationDuration.greaterThanOrEqual=" + UPDATED_LAST_OPERATION_DURATION);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByLastOperationDurationIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where lastOperationDuration is less than or equal to DEFAULT_LAST_OPERATION_DURATION
        defaultBankAccountShouldBeFound("lastOperationDuration.lessThanOrEqual=" + DEFAULT_LAST_OPERATION_DURATION);

        // Get all the bankAccountList where lastOperationDuration is less than or equal to SMALLER_LAST_OPERATION_DURATION
        defaultBankAccountShouldNotBeFound("lastOperationDuration.lessThanOrEqual=" + SMALLER_LAST_OPERATION_DURATION);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByLastOperationDurationIsLessThanSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where lastOperationDuration is less than DEFAULT_LAST_OPERATION_DURATION
        defaultBankAccountShouldNotBeFound("lastOperationDuration.lessThan=" + DEFAULT_LAST_OPERATION_DURATION);

        // Get all the bankAccountList where lastOperationDuration is less than UPDATED_LAST_OPERATION_DURATION
        defaultBankAccountShouldBeFound("lastOperationDuration.lessThan=" + UPDATED_LAST_OPERATION_DURATION);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByLastOperationDurationIsGreaterThanSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where lastOperationDuration is greater than DEFAULT_LAST_OPERATION_DURATION
        defaultBankAccountShouldNotBeFound("lastOperationDuration.greaterThan=" + DEFAULT_LAST_OPERATION_DURATION);

        // Get all the bankAccountList where lastOperationDuration is greater than SMALLER_LAST_OPERATION_DURATION
        defaultBankAccountShouldBeFound("lastOperationDuration.greaterThan=" + SMALLER_LAST_OPERATION_DURATION);
    }


    @Test
    @Transactional
    public void getAllBankAccountsByMeanOperationDurationIsEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where meanOperationDuration equals to DEFAULT_MEAN_OPERATION_DURATION
        defaultBankAccountShouldBeFound("meanOperationDuration.equals=" + DEFAULT_MEAN_OPERATION_DURATION);

        // Get all the bankAccountList where meanOperationDuration equals to UPDATED_MEAN_OPERATION_DURATION
        defaultBankAccountShouldNotBeFound("meanOperationDuration.equals=" + UPDATED_MEAN_OPERATION_DURATION);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByMeanOperationDurationIsNotEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where meanOperationDuration not equals to DEFAULT_MEAN_OPERATION_DURATION
        defaultBankAccountShouldNotBeFound("meanOperationDuration.notEquals=" + DEFAULT_MEAN_OPERATION_DURATION);

        // Get all the bankAccountList where meanOperationDuration not equals to UPDATED_MEAN_OPERATION_DURATION
        defaultBankAccountShouldBeFound("meanOperationDuration.notEquals=" + UPDATED_MEAN_OPERATION_DURATION);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByMeanOperationDurationIsInShouldWork() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where meanOperationDuration in DEFAULT_MEAN_OPERATION_DURATION or UPDATED_MEAN_OPERATION_DURATION
        defaultBankAccountShouldBeFound("meanOperationDuration.in=" + DEFAULT_MEAN_OPERATION_DURATION + "," + UPDATED_MEAN_OPERATION_DURATION);

        // Get all the bankAccountList where meanOperationDuration equals to UPDATED_MEAN_OPERATION_DURATION
        defaultBankAccountShouldNotBeFound("meanOperationDuration.in=" + UPDATED_MEAN_OPERATION_DURATION);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByMeanOperationDurationIsNullOrNotNull() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where meanOperationDuration is not null
        defaultBankAccountShouldBeFound("meanOperationDuration.specified=true");

        // Get all the bankAccountList where meanOperationDuration is null
        defaultBankAccountShouldNotBeFound("meanOperationDuration.specified=false");
    }

    @Test
    @Transactional
    public void getAllBankAccountsByMeanOperationDurationIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where meanOperationDuration is greater than or equal to DEFAULT_MEAN_OPERATION_DURATION
        defaultBankAccountShouldBeFound("meanOperationDuration.greaterThanOrEqual=" + DEFAULT_MEAN_OPERATION_DURATION);

        // Get all the bankAccountList where meanOperationDuration is greater than or equal to UPDATED_MEAN_OPERATION_DURATION
        defaultBankAccountShouldNotBeFound("meanOperationDuration.greaterThanOrEqual=" + UPDATED_MEAN_OPERATION_DURATION);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByMeanOperationDurationIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where meanOperationDuration is less than or equal to DEFAULT_MEAN_OPERATION_DURATION
        defaultBankAccountShouldBeFound("meanOperationDuration.lessThanOrEqual=" + DEFAULT_MEAN_OPERATION_DURATION);

        // Get all the bankAccountList where meanOperationDuration is less than or equal to SMALLER_MEAN_OPERATION_DURATION
        defaultBankAccountShouldNotBeFound("meanOperationDuration.lessThanOrEqual=" + SMALLER_MEAN_OPERATION_DURATION);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByMeanOperationDurationIsLessThanSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where meanOperationDuration is less than DEFAULT_MEAN_OPERATION_DURATION
        defaultBankAccountShouldNotBeFound("meanOperationDuration.lessThan=" + DEFAULT_MEAN_OPERATION_DURATION);

        // Get all the bankAccountList where meanOperationDuration is less than UPDATED_MEAN_OPERATION_DURATION
        defaultBankAccountShouldBeFound("meanOperationDuration.lessThan=" + UPDATED_MEAN_OPERATION_DURATION);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByMeanOperationDurationIsGreaterThanSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where meanOperationDuration is greater than DEFAULT_MEAN_OPERATION_DURATION
        defaultBankAccountShouldNotBeFound("meanOperationDuration.greaterThan=" + DEFAULT_MEAN_OPERATION_DURATION);

        // Get all the bankAccountList where meanOperationDuration is greater than SMALLER_MEAN_OPERATION_DURATION
        defaultBankAccountShouldBeFound("meanOperationDuration.greaterThan=" + SMALLER_MEAN_OPERATION_DURATION);
    }


    @Test
    @Transactional
    public void getAllBankAccountsByBalanceIsEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where balance equals to DEFAULT_BALANCE
        defaultBankAccountShouldBeFound("balance.equals=" + DEFAULT_BALANCE);

        // Get all the bankAccountList where balance equals to UPDATED_BALANCE
        defaultBankAccountShouldNotBeFound("balance.equals=" + UPDATED_BALANCE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByBalanceIsNotEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where balance not equals to DEFAULT_BALANCE
        defaultBankAccountShouldNotBeFound("balance.notEquals=" + DEFAULT_BALANCE);

        // Get all the bankAccountList where balance not equals to UPDATED_BALANCE
        defaultBankAccountShouldBeFound("balance.notEquals=" + UPDATED_BALANCE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByBalanceIsInShouldWork() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where balance in DEFAULT_BALANCE or UPDATED_BALANCE
        defaultBankAccountShouldBeFound("balance.in=" + DEFAULT_BALANCE + "," + UPDATED_BALANCE);

        // Get all the bankAccountList where balance equals to UPDATED_BALANCE
        defaultBankAccountShouldNotBeFound("balance.in=" + UPDATED_BALANCE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByBalanceIsNullOrNotNull() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where balance is not null
        defaultBankAccountShouldBeFound("balance.specified=true");

        // Get all the bankAccountList where balance is null
        defaultBankAccountShouldNotBeFound("balance.specified=false");
    }

    @Test
    @Transactional
    public void getAllBankAccountsByBalanceIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where balance is greater than or equal to DEFAULT_BALANCE
        defaultBankAccountShouldBeFound("balance.greaterThanOrEqual=" + DEFAULT_BALANCE);

        // Get all the bankAccountList where balance is greater than or equal to UPDATED_BALANCE
        defaultBankAccountShouldNotBeFound("balance.greaterThanOrEqual=" + UPDATED_BALANCE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByBalanceIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where balance is less than or equal to DEFAULT_BALANCE
        defaultBankAccountShouldBeFound("balance.lessThanOrEqual=" + DEFAULT_BALANCE);

        // Get all the bankAccountList where balance is less than or equal to SMALLER_BALANCE
        defaultBankAccountShouldNotBeFound("balance.lessThanOrEqual=" + SMALLER_BALANCE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByBalanceIsLessThanSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where balance is less than DEFAULT_BALANCE
        defaultBankAccountShouldNotBeFound("balance.lessThan=" + DEFAULT_BALANCE);

        // Get all the bankAccountList where balance is less than UPDATED_BALANCE
        defaultBankAccountShouldBeFound("balance.lessThan=" + UPDATED_BALANCE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByBalanceIsGreaterThanSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where balance is greater than DEFAULT_BALANCE
        defaultBankAccountShouldNotBeFound("balance.greaterThan=" + DEFAULT_BALANCE);

        // Get all the bankAccountList where balance is greater than SMALLER_BALANCE
        defaultBankAccountShouldBeFound("balance.greaterThan=" + SMALLER_BALANCE);
    }


    @Test
    @Transactional
    public void getAllBankAccountsByOpeningDayIsEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where openingDay equals to DEFAULT_OPENING_DAY
        defaultBankAccountShouldBeFound("openingDay.equals=" + DEFAULT_OPENING_DAY);

        // Get all the bankAccountList where openingDay equals to UPDATED_OPENING_DAY
        defaultBankAccountShouldNotBeFound("openingDay.equals=" + UPDATED_OPENING_DAY);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByOpeningDayIsNotEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where openingDay not equals to DEFAULT_OPENING_DAY
        defaultBankAccountShouldNotBeFound("openingDay.notEquals=" + DEFAULT_OPENING_DAY);

        // Get all the bankAccountList where openingDay not equals to UPDATED_OPENING_DAY
        defaultBankAccountShouldBeFound("openingDay.notEquals=" + UPDATED_OPENING_DAY);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByOpeningDayIsInShouldWork() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where openingDay in DEFAULT_OPENING_DAY or UPDATED_OPENING_DAY
        defaultBankAccountShouldBeFound("openingDay.in=" + DEFAULT_OPENING_DAY + "," + UPDATED_OPENING_DAY);

        // Get all the bankAccountList where openingDay equals to UPDATED_OPENING_DAY
        defaultBankAccountShouldNotBeFound("openingDay.in=" + UPDATED_OPENING_DAY);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByOpeningDayIsNullOrNotNull() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where openingDay is not null
        defaultBankAccountShouldBeFound("openingDay.specified=true");

        // Get all the bankAccountList where openingDay is null
        defaultBankAccountShouldNotBeFound("openingDay.specified=false");
    }

    @Test
    @Transactional
    public void getAllBankAccountsByOpeningDayIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where openingDay is greater than or equal to DEFAULT_OPENING_DAY
        defaultBankAccountShouldBeFound("openingDay.greaterThanOrEqual=" + DEFAULT_OPENING_DAY);

        // Get all the bankAccountList where openingDay is greater than or equal to UPDATED_OPENING_DAY
        defaultBankAccountShouldNotBeFound("openingDay.greaterThanOrEqual=" + UPDATED_OPENING_DAY);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByOpeningDayIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where openingDay is less than or equal to DEFAULT_OPENING_DAY
        defaultBankAccountShouldBeFound("openingDay.lessThanOrEqual=" + DEFAULT_OPENING_DAY);

        // Get all the bankAccountList where openingDay is less than or equal to SMALLER_OPENING_DAY
        defaultBankAccountShouldNotBeFound("openingDay.lessThanOrEqual=" + SMALLER_OPENING_DAY);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByOpeningDayIsLessThanSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where openingDay is less than DEFAULT_OPENING_DAY
        defaultBankAccountShouldNotBeFound("openingDay.lessThan=" + DEFAULT_OPENING_DAY);

        // Get all the bankAccountList where openingDay is less than UPDATED_OPENING_DAY
        defaultBankAccountShouldBeFound("openingDay.lessThan=" + UPDATED_OPENING_DAY);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByOpeningDayIsGreaterThanSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where openingDay is greater than DEFAULT_OPENING_DAY
        defaultBankAccountShouldNotBeFound("openingDay.greaterThan=" + DEFAULT_OPENING_DAY);

        // Get all the bankAccountList where openingDay is greater than SMALLER_OPENING_DAY
        defaultBankAccountShouldBeFound("openingDay.greaterThan=" + SMALLER_OPENING_DAY);
    }


    @Test
    @Transactional
    public void getAllBankAccountsByLastOperationDateIsEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where lastOperationDate equals to DEFAULT_LAST_OPERATION_DATE
        defaultBankAccountShouldBeFound("lastOperationDate.equals=" + DEFAULT_LAST_OPERATION_DATE);

        // Get all the bankAccountList where lastOperationDate equals to UPDATED_LAST_OPERATION_DATE
        defaultBankAccountShouldNotBeFound("lastOperationDate.equals=" + UPDATED_LAST_OPERATION_DATE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByLastOperationDateIsNotEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where lastOperationDate not equals to DEFAULT_LAST_OPERATION_DATE
        defaultBankAccountShouldNotBeFound("lastOperationDate.notEquals=" + DEFAULT_LAST_OPERATION_DATE);

        // Get all the bankAccountList where lastOperationDate not equals to UPDATED_LAST_OPERATION_DATE
        defaultBankAccountShouldBeFound("lastOperationDate.notEquals=" + UPDATED_LAST_OPERATION_DATE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByLastOperationDateIsInShouldWork() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where lastOperationDate in DEFAULT_LAST_OPERATION_DATE or UPDATED_LAST_OPERATION_DATE
        defaultBankAccountShouldBeFound("lastOperationDate.in=" + DEFAULT_LAST_OPERATION_DATE + "," + UPDATED_LAST_OPERATION_DATE);

        // Get all the bankAccountList where lastOperationDate equals to UPDATED_LAST_OPERATION_DATE
        defaultBankAccountShouldNotBeFound("lastOperationDate.in=" + UPDATED_LAST_OPERATION_DATE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByLastOperationDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where lastOperationDate is not null
        defaultBankAccountShouldBeFound("lastOperationDate.specified=true");

        // Get all the bankAccountList where lastOperationDate is null
        defaultBankAccountShouldNotBeFound("lastOperationDate.specified=false");
    }

    @Test
    @Transactional
    public void getAllBankAccountsByActiveIsEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where active equals to DEFAULT_ACTIVE
        defaultBankAccountShouldBeFound("active.equals=" + DEFAULT_ACTIVE);

        // Get all the bankAccountList where active equals to UPDATED_ACTIVE
        defaultBankAccountShouldNotBeFound("active.equals=" + UPDATED_ACTIVE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByActiveIsNotEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where active not equals to DEFAULT_ACTIVE
        defaultBankAccountShouldNotBeFound("active.notEquals=" + DEFAULT_ACTIVE);

        // Get all the bankAccountList where active not equals to UPDATED_ACTIVE
        defaultBankAccountShouldBeFound("active.notEquals=" + UPDATED_ACTIVE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByActiveIsInShouldWork() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where active in DEFAULT_ACTIVE or UPDATED_ACTIVE
        defaultBankAccountShouldBeFound("active.in=" + DEFAULT_ACTIVE + "," + UPDATED_ACTIVE);

        // Get all the bankAccountList where active equals to UPDATED_ACTIVE
        defaultBankAccountShouldNotBeFound("active.in=" + UPDATED_ACTIVE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByActiveIsNullOrNotNull() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where active is not null
        defaultBankAccountShouldBeFound("active.specified=true");

        // Get all the bankAccountList where active is null
        defaultBankAccountShouldNotBeFound("active.specified=false");
    }

    @Test
    @Transactional
    public void getAllBankAccountsByAccountTypeIsEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where accountType equals to DEFAULT_ACCOUNT_TYPE
        defaultBankAccountShouldBeFound("accountType.equals=" + DEFAULT_ACCOUNT_TYPE);

        // Get all the bankAccountList where accountType equals to UPDATED_ACCOUNT_TYPE
        defaultBankAccountShouldNotBeFound("accountType.equals=" + UPDATED_ACCOUNT_TYPE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByAccountTypeIsNotEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where accountType not equals to DEFAULT_ACCOUNT_TYPE
        defaultBankAccountShouldNotBeFound("accountType.notEquals=" + DEFAULT_ACCOUNT_TYPE);

        // Get all the bankAccountList where accountType not equals to UPDATED_ACCOUNT_TYPE
        defaultBankAccountShouldBeFound("accountType.notEquals=" + UPDATED_ACCOUNT_TYPE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByAccountTypeIsInShouldWork() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where accountType in DEFAULT_ACCOUNT_TYPE or UPDATED_ACCOUNT_TYPE
        defaultBankAccountShouldBeFound("accountType.in=" + DEFAULT_ACCOUNT_TYPE + "," + UPDATED_ACCOUNT_TYPE);

        // Get all the bankAccountList where accountType equals to UPDATED_ACCOUNT_TYPE
        defaultBankAccountShouldNotBeFound("accountType.in=" + UPDATED_ACCOUNT_TYPE);
    }

    @Test
    @Transactional
    public void getAllBankAccountsByAccountTypeIsNullOrNotNull() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList where accountType is not null
        defaultBankAccountShouldBeFound("accountType.specified=true");

        // Get all the bankAccountList where accountType is null
        defaultBankAccountShouldNotBeFound("accountType.specified=false");
    }

    @Test
    @Transactional
    public void getAllBankAccountsByOperationIsEqualToSomething() throws Exception {
        // Initialize the database
        bankAccountRepository.saveAndFlush(bankAccount);
        Operation operation = OperationResourceIT.createEntity(em);
        em.persist(operation);
        em.flush();
        bankAccount.addOperation(operation);
        bankAccountRepository.saveAndFlush(bankAccount);
        Long operationId = operation.getId();

        // Get all the bankAccountList where operation equals to operationId
        defaultBankAccountShouldBeFound("operationId.equals=" + operationId);

        // Get all the bankAccountList where operation equals to operationId + 1
        defaultBankAccountShouldNotBeFound("operationId.equals=" + (operationId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultBankAccountShouldBeFound(String filter) throws Exception {
        restBankAccountMockMvc.perform(get("/api/bank-accounts?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bankAccount.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].bankNumber").value(hasItem(DEFAULT_BANK_NUMBER)))
            .andExpect(jsonPath("$.[*].agencyNumber").value(hasItem(DEFAULT_AGENCY_NUMBER.intValue())))
            .andExpect(jsonPath("$.[*].lastOperationDuration").value(hasItem(DEFAULT_LAST_OPERATION_DURATION.doubleValue())))
            .andExpect(jsonPath("$.[*].meanOperationDuration").value(hasItem(DEFAULT_MEAN_OPERATION_DURATION.doubleValue())))
            .andExpect(jsonPath("$.[*].balance").value(hasItem(DEFAULT_BALANCE.intValue())))
            .andExpect(jsonPath("$.[*].openingDay").value(hasItem(DEFAULT_OPENING_DAY.toString())))
            .andExpect(jsonPath("$.[*].lastOperationDate").value(hasItem(DEFAULT_LAST_OPERATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].accountType").value(hasItem(DEFAULT_ACCOUNT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].attachmentContentType").value(hasItem(DEFAULT_ATTACHMENT_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].attachment").value(hasItem(Base64Utils.encodeToString(DEFAULT_ATTACHMENT))))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));

        // Check, that the count call also returns 1
        restBankAccountMockMvc.perform(get("/api/bank-accounts/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultBankAccountShouldNotBeFound(String filter) throws Exception {
        restBankAccountMockMvc.perform(get("/api/bank-accounts?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restBankAccountMockMvc.perform(get("/api/bank-accounts/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    public void getNonExistingBankAccount() throws Exception {
        // Get the bankAccount
        restBankAccountMockMvc.perform(get("/api/bank-accounts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBankAccount() throws Exception {
        // Initialize the database
        bankAccountService.save(bankAccount);

        int databaseSizeBeforeUpdate = bankAccountRepository.findAll().size();

        // Update the bankAccount
        BankAccount updatedBankAccount = bankAccountRepository.findById(bankAccount.getId()).get();
        // Disconnect from session so that the updates on updatedBankAccount are not directly saved in db
        em.detach(updatedBankAccount);
        updatedBankAccount
            .name(UPDATED_NAME)
            .bankNumber(UPDATED_BANK_NUMBER)
            .agencyNumber(UPDATED_AGENCY_NUMBER)
            .lastOperationDuration(UPDATED_LAST_OPERATION_DURATION)
            .meanOperationDuration(UPDATED_MEAN_OPERATION_DURATION)
            .balance(UPDATED_BALANCE)
            .openingDay(UPDATED_OPENING_DAY)
            .lastOperationDate(UPDATED_LAST_OPERATION_DATE)
            .active(UPDATED_ACTIVE)
            .accountType(UPDATED_ACCOUNT_TYPE)
            .attachment(UPDATED_ATTACHMENT)
            .attachmentContentType(UPDATED_ATTACHMENT_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION);

        restBankAccountMockMvc.perform(put("/api/bank-accounts").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedBankAccount)))
            .andExpect(status().isOk());

        // Validate the BankAccount in the database
        List<BankAccount> bankAccountList = bankAccountRepository.findAll();
        assertThat(bankAccountList).hasSize(databaseSizeBeforeUpdate);
        BankAccount testBankAccount = bankAccountList.get(bankAccountList.size() - 1);
        assertThat(testBankAccount.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBankAccount.getBankNumber()).isEqualTo(UPDATED_BANK_NUMBER);
        assertThat(testBankAccount.getAgencyNumber()).isEqualTo(UPDATED_AGENCY_NUMBER);
        assertThat(testBankAccount.getLastOperationDuration()).isEqualTo(UPDATED_LAST_OPERATION_DURATION);
        assertThat(testBankAccount.getMeanOperationDuration()).isEqualTo(UPDATED_MEAN_OPERATION_DURATION);
        assertThat(testBankAccount.getBalance()).isEqualTo(UPDATED_BALANCE);
        assertThat(testBankAccount.getOpeningDay()).isEqualTo(UPDATED_OPENING_DAY);
        assertThat(testBankAccount.getLastOperationDate()).isEqualTo(UPDATED_LAST_OPERATION_DATE);
        assertThat(testBankAccount.isActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testBankAccount.getAccountType()).isEqualTo(UPDATED_ACCOUNT_TYPE);
        assertThat(testBankAccount.getAttachment()).isEqualTo(UPDATED_ATTACHMENT);
        assertThat(testBankAccount.getAttachmentContentType()).isEqualTo(UPDATED_ATTACHMENT_CONTENT_TYPE);
        assertThat(testBankAccount.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingBankAccount() throws Exception {
        int databaseSizeBeforeUpdate = bankAccountRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBankAccountMockMvc.perform(put("/api/bank-accounts").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bankAccount)))
            .andExpect(status().isBadRequest());

        // Validate the BankAccount in the database
        List<BankAccount> bankAccountList = bankAccountRepository.findAll();
        assertThat(bankAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBankAccount() throws Exception {
        // Initialize the database
        bankAccountService.save(bankAccount);

        int databaseSizeBeforeDelete = bankAccountRepository.findAll().size();

        // Delete the bankAccount
        restBankAccountMockMvc.perform(delete("/api/bank-accounts/{id}", bankAccount.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BankAccount> bankAccountList = bankAccountRepository.findAll();
        assertThat(bankAccountList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
