SRC = js/f.core.js js/f.event.js js/f.mvc.js

COMBINE = js/f.js
COMPRESS = js/f.min.js
 
$(COMBINE) : $(SRC)
	cat $^ > $@

	java -jar /Applications/gcc/compiler.jar --js $(COMBINE) --js_output_file $(COMPRESS)

.PHONY: clean
clean :
	rm -f $(COMBINE) $(COMPRESS)

