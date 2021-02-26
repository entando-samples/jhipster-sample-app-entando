package com.entando.sample.web.rest;

import com.entando.sample.domain.Label;
import com.entando.sample.service.LabelService;
import com.entando.sample.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.entando.sample.domain.Label}.
 */
@RestController
@RequestMapping("/api")
public class LabelResource {

    private final Logger log = LoggerFactory.getLogger(LabelResource.class);

    private final LabelService labelService;

    public LabelResource(LabelService labelService) {
        this.labelService = labelService;
    }

    /**
     * {@code GET  /labels} : get all the labels.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of labels in body.
     */
    @GetMapping("/labels")
    public ResponseEntity<List<Label>> getAllLabels(Pageable pageable) {
        log.debug("REST request to get a page of Labels");
        Page<Label> page = labelService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /labels/:id} : get the "id" label.
     *
     * @param id the id of the label to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the label, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/labels/{id}")
    public ResponseEntity<Label> getLabel(@PathVariable Long id) {
        log.debug("REST request to get Label : {}", id);
        Optional<Label> label = labelService.findOne(id);
        return ResponseUtil.wrapOrNotFound(label);
    }
}
